const sqlite3 = require('sqlite3');
let db;

class Transaction {
    constructor() {
        db.run(`BEGIN TRANSACTION`);
    }
    
    commit() {
        db.run(`COMMIT TRANSACTION`);
    }
    
    discard() {
        db.run(`ROLLBACK TRANSACTION`);
    }
}

module.exports = {
    "initialize": function(options = {}) {
        console.log("Initializing Database...");
        if (!options.fileName) options.fileName = 'database.db';
        
        if (options.fileName == ":memory:") console.log("Creating in-memory database. Changes will not be saved!");
        
        db = new sqlite3.Database(options.fileName);
        db.configure("trace", function(text) {
            console.log(text);
        });
        
        //Create tables if required
        db.serialize(function() {
            //Turn on foreign keys
            db.get("PRAGMA foreign_keys = ON");
            
            db.run(`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS Tokens(token TEXT PRIMARY KEY, userId INTEGER, date INTEGER, FOREIGN KEY(userId) REFERENCES Users(id))`);
            db.run(`CREATE TABLE IF NOT EXISTS Resources(id INTEGER PRIMARY KEY, filename TEXT)`);
            db.run(`CREATE TABLE IF NOT EXISTS Posts(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, image INTEGER, deleted INTEGER, FOREIGN KEY(userId) REFERENCES Users(id), FOREIGN KEY (image) REFERENCES Resources(id))`);
            db.run(`CREATE TABLE IF NOT EXISTS Comments(id INTEGER PRIMARY KEY, replyTo INTEGER, CONSTRAINT fk_sup_comments_id FOREIGN KEY (id) REFERENCES Posts(id) ON DELETE CASCADE)`);
            db.run(`CREATE TABLE IF NOT EXISTS Reactions(postId INTEGER, userId INTEGER, emoji TEXT, PRIMARY KEY(postId, userId, emoji), FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE, FOREIGN KEY (userId) REFERENCES Users(id))`);
            db.run(`CREATE TABLE IF NOT EXISTS Flags(postId INTEGER, userId INTEGER, flagType INTEGER, PRIMARY KEY(postId, userId), FOREIGN KEY (postId) REFERENCES Posts(id), FOREIGN KEY (userId) REFERENCES Users(id))`);
        });
    },
    "runQuery": function(query) {
        return db.run(query);
    },
    "allQuery": function(query, args = []) {
        return new Promise(function(res, rej) {
            db.all(query, args, function(err, rows) {
                if (err) {
                    rej(err);
                } else {
                    res(rows);
                }
            });
        });
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
    "delete": function(tableName, whereString, parameters) {
        return new Promise(function(res, rej) {
            db.run(`DELETE FROM ${tableName} WHERE ${whereString}`, parameters, function(err, rows) {
                if (err) {
                    rej(err);
                } else {
                    res(this);
                }
            });
        });
    },
    "update": function(tableName, changes, whereString, parameters) {
        let params = [];
        
        let setString = [];
        for (key in changes) {
            setString.push(key + " = ?");
            params.push(changes[key]);
        }
        
        params = params.concat(parameters);
        
        return new Promise(function(res, rej) {
            db.run(`UPDATE ${tableName} SET ${setString.join(", ")} WHERE ${whereString}`, params, function(err) {
                if (err) {
                    rej(err);
                } else {
                    res(this);
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
    },
    
    "transaction": function() {
        return new Transaction();
    }
};
