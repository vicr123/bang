const express = require('express');
const db = require('../db/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//bcrypt options
const saltRounds = 12;

let router = express.Router();
router.use(express.json());
module.exports = router;

async function generateTokenForUser(userId) {
    do {
        let token = crypto.randomBytes(64).toString('hex');
        //Ensure this token doesn't exist
        
        let rows = await db.select("Tokens", ["userId"], "TOKEN = ?", [token]);
        if (rows.length == 0) {
            await db.insert("Tokens", {
                token: token,
                userId: userId,
                date: (new Date()).getTime()
            });
            return token;
        }
    } while (true);
}

/**
 * POST /getToken
 * Retrieve a user's token
 * 
 * Body: JSON Object {
 *           "username": Username of the user of which to retrieve a token,
 *           "password": Password of the user of which to retrieve a token,
 *           "totpCode": Time-based OTP passcode for the user (optional)
 *       }
 *
 * Returns: 200: JSON Object {
 *              "token": Token of the user,
 *              "id": User ID
 *          }
 *
 * Returns: 403: null
 */
router.post("/getToken", function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            "error": "Missing fields"
        });
    } else {
        (async function() {
            //Retrieve the user from the database
            let rows = await db.select("Users", ["id", "password"], "USERNAME = ?", [req.body.username]);
            if (rows.length == 0) {
                res.status(403).send();
                return;
            }
            
            let row = rows[0];
            let hashedPassword = row.password;
            
            //Verify the password
            let isPasswordCorrect = await bcrypt.compare(req.body.password, hashedPassword);
            if (!isPasswordCorrect) {
                res.status(403).send();
                return;
            }
            
            //Generate a token
            let token = await generateTokenForUser(row.id);
            
            res.status(200).send({
                "token": token,
                "id": row.id
            });
        })();
    }
});

router.get("/whoami", function(req, res) {
    (async function() {
        let token = req.get("Authorization");
        if (!token.startsWith("Token ")) {
            res.status(403).send();
            return;
        }
        token = token.substr(6);
        
        //Retrieve the user ID from the database
        let rows = await db.select("Tokens", ["userId"], "TOKEN = ?", [token]);
        if (rows.length == 0) {
            res.status(403).send();
            return;
        }
        
        let row = rows[0];
        
        //Retrieve the user from the database
        let userRows = await db.select("Users", ["username"], "ID = ?", [row.userId]);
        
        res.status(200).send({
            "username": userRows[0].username
        });
    })();
});

/**
 * POST /create
 * Create a user account
 * 
 * Body: JSON Object {
 *           "username": Username of the new user,
 *           "password": Password of the new user,
 *       }
 *
 * Returns: 200: JSON Object {
 *              "token": Token of the user,
 *              "id": User ID
 *          }
 *
 * Returns: 400: JSON Object {
 *              "error": Description of the error
 *          }
 */
router.post("/create", function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            "error": "Missing fields"
        });
    } else {
        (async function() {
            //Hash and salt the password
            let passwordHash = await bcrypt.hash(req.body.password, saltRounds);
            await db.insert("Users", {
                username: req.body.username,
                password: passwordHash
            });
            
            //Get the user ID
            let id = await db.lastInsertId();
            
            //Get the token
            let token = await generateTokenForUser(id);
            
            await res.status(200).send({
                "token": token,
                "id": id
            });
        })().catch(function() {
            //Internal Server Error
            res.status(500).send();
        });
    }
});