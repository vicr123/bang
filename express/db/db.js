const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.db');
db.configure("trace", function(text) {
    console.log(text);
})

//Create tables if required
db.serialize(function() {
    db.run(`CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT, username, password)`);
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
    "select": function(tableName, columns, whereString, parameters) {
        let colString = columns.join(", ");
        return new Promise(function(res, rej) {
            db.all(`SELECT ${columns} FROM ${tableName} WHERE ${whereString}`, parameters, function(err, rows) {
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
