const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db');
db.configure("trace", function(text) {
    console.log(text);
})

//Create tables if required
db.serialize(function() {
    //Turn on foreign keys
    db.get("PRAGMA foreign_keys = ON");
    
    db.run(`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS Tokens(token TEXT PRIMARY KEY, userId INTEGER, date INTEGER, FOREIGN KEY (userId) REFERENCES Users(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS Resources(id INTEGER PRIMARY KEY, filename TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS Posts(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, image INTEGER, FOREIGN KEY (userId) REFERENCES Users(id), FOREIGN KEY (image) REFERENCES Resources(id))`);
});

module.exports = {
    "runQuery": function(query) {
        return db.run(query);
    },
    "insert": function(tableName, parameters) {
        let setString = [];
        let valueString = [];
        let values = [];
        for (key in parameters) {
            setString.push(key);
            valueString.push('?');
            values.push(parameters[key]);
        }
        return new Promise(function(res, rej) {
            db.run(`INSERT INTO ${tableName}(${setString.join(", ")}) VALUES (${valueString.join(", ")})`, values, function(err) {
                if (err) {
                    rej(err);
                } else {
                    res(this);
                }
            });
        });
    },
    "select": function(tableName, columns, whereString, parameters, extraArgs = "") {
        let colString = columns.join(", ");
        return new Promise(function(res, rej) {
            db.all(`SELECT ${columns} FROM ${tableName} WHERE ${whereString} ${extraArgs}`, parameters, function(err, rows) {
                if (err) {
                    rej(err);
                } else {
                    res(rows);
                }
            });
        });
    },
    "lastInsertId": function() {
        return new Promise(function(res, rej) {
            db.get(`SELECT last_insert_rowid()`, [], function(err, row) {
                if (err) {
                    rej(err);
                } else {
                    res(row["last_insert_rowid()"]);
                }
            });
        });
    }
};
