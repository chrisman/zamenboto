'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require ('slackbots');

var ZamenBoto = function Constuctor(settings) {
	this.settings = settings;
	this.settings.name = this.settings.name || 'zamenboto';
	this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'zamenboto.db');
	this.user = null;
	this.db = null;
};

util.inherits(ZamenBoto, Bot);

ZamenBoto.prototype.run = function(){
	ZamenBoto.super_.call(this, this.settings);

	this.on('start', this._onStart);
	this.on('message', this._onMessage);
};

/*
 * onStart
 * 
 **/

ZamenBoto.prototype._onStart = function(){
	this._loadBotUser();
	this._connectDb();
	this._firstRunCheck();
};
ZamenBoto.prototype._loadBotUser = function(){
	var that = this;
	this.user = this.users.filter(function(u){
		return u.name === that.name;
	})[0];
};
ZamenBoto.prototype._connectDb = function(){
	if(!fs.existsSync(this.dbPath)) {
		console.error('Database path "' + this.dbPath + '" does not exist, or is not readable.');
		process.exit(1);
	}
	this.db = new SQLite.Database(this.dbPath);
};
ZamenBoto.prototype._firstRunCheck = function(){
	var that = this;
	that.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function(err, record){
		if (err) {
			return console.error('DATABASE ERROR:', err);
		}
		var currentTime = (new Date()).toJSON();

		if (!record) {
			that._welcomeMessage();
			return that.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
		}

		that.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
	});
};
ZamenBoto.prototype._welcomeMessage = function(){
	this.postMessageToChannel(this.channels[0].name, 'Saluton, amikoj! Mi povas diri sxercojn. Nur diru "Zamenhof" aux "'+ this.name +'"!', {as_user: true});
};

/*
 * onMessage
 * 
 **/

ZamenBoto.prototype._onMessage = function(message){
	if(
		this._isChatMessage(message) &&
		this._isChannelConversation(message) &&
		!this._isFromZamenBoto(message) &&
		this._isMentioningZamenhof(message)
	) {
		this._replyWithRandomJoke(message);
	}	
};
ZamenBoto.prototype._isChatMessage = function (message) {
	return message.type === 'message' && Boolean(message.text);
};
ZamenBoto.prototype._isChannelConversation = function (message) {
	return typeof message.channel === 'string' && message.channel[0] === 'C';
};
ZamenBoto.prototype._isFromZamenBoto = function (message) {
	return message.user === this.user.id;
};
ZamenBoto.prototype._isMentioningZamenhof = function (message) {
	return message.text.toLowerCase().indexOf('zamenhof') > -1 || message.text.toLowerCase().indexOf(this.name) > -1;
};
ZamenBoto.prototype._replyWithRandomJoke = function (originalMessage) {
	var that = this;
	that.db.get('SELECT id, joke FROM jokes ORDER BY used ASC, RANDOM() LIMIT 1',function(err, record){
		if (err) {
			return console.error('DATABASE ERROR:', err);
		}

		var channel = that._getChannelById(originalMessage.channel);
		that.postMessageToChannel(channel.name, record.joke, {as_user: true});
		that.db.run('UPDATE jokes SET used = used + 1 WHERE id = ?', record.id);	
	});	
};
ZamenBoto.prototype._getChannelById = function (channelId) {
	return this.channels.filter(function (item) {
		return item.id === channelId;
	})[0];
};

module.exports = ZamenBoto;
