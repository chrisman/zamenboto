'use strict';

var ZamenBoto = require('../lib/zamenboto');

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var zamenboto = new ZamenBoto({
	token: token,
	dbPath: dbPath,
	name: name
});

zamenboto.run();
