'use strict';

var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

var outputFile = process.argv[2] || path.resolve(__dirname, 'norrisbot.db');
var db = new sqlite3.Database(outputFile);

fs.readFile('data.json', function(error, body){
  // db.serialize();
  // // Creates the database structure
  // db.run('CREATE TABLE IF NOT EXISTS info (name TEXT PRIMARY KEY, val TEXT DEFAULT NULL)');
  // db.run('CREATE TABLE IF NOT EXISTS jokes (id INTEGER PRIMARY KEY, joke TEXT, used INTEGER DEFAULT 0)');
  // db.run('CREATE INDEX jokes_used_idx ON jokes (used)');

  var data = JSON.parse(body.toString())["value"]
  console.log(data);
  var collector = Object.keys(data).map(function(i){
    return data[i]["joke"];
  });
  console.log(collector);
});
