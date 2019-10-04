const express = require('express');
const db = require('../db/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const tokens = require('./helpers/token');

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
 * POST /users/getToken
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
 * Returns: 400: JSON Object {
 *              "error": Description of the error
 *          }
 *
 * Returns: 401: null
 */
router.post("/getToken", async function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            "error": "Missing fields"
        });
    } else {
        let username = req.body.username.trim();
        if (username === "") {
            res.status(400).send({
                "error": "Empty Username"
            });
            return;
        } else if (username.length > 20) {
            res.status(400).send({
                "error": "Username greater than 20 characters"
            });
            return;
        } else if (req.body.password.length > 128) {
            res.status(400).send({
                "error": "Password greater than 128 characters"
            });
            return;
        } else if (req.body.password.length < 8) {
            res.status(400).send({
                "error": "Password less than 8 characters"
            });
            return;
        }
        
        //Retrieve the user from the database
        let rows = await db.select("Users", ["id", "password"], "USERNAME = ?", [username]);
        if (rows.length == 0) {
            res.status(401).send();
            return;
        }
        
        let row = rows[0];
        let hashedPassword = row.password;
        
        //Verify the password
        let isPasswordCorrect = await bcrypt.compare(req.body.password, hashedPassword);
        if (!isPasswordCorrect) {
            res.status(401).send();
            return;
        }
        
        //Generate a token
        let token = await generateTokenForUser(row.id);
        
        res.status(200).send({
            "token": token,
            "id": row.id
        });
    }
});

/**
 * GET /users/whoami
 * Get information about the currently logged in user
 * Requires authentication
 *
 * Returns: 200: JSON Object {
 *              "username": Username of the logged in user
 *          }
 *
 * Returns: 401 (Unauthorized)
 */
router.get("/whoami", async function(req, res) {
    try {
        let userRows = await tokens.getUser(req);
        
        res.status(200).send({
            "username": userRows[0].username,
            "id": userRows[0].id
        });
    } catch (e) {
        //Invalid token or no one logged in
        res.status(401).send();
    }
});

/**
 * POST /users/create
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
            let username = req.body.username.trim();
            
            if (username === "") {
                res.status(400).send({
                    "error": "Empty Username"
                });
                return;
            } else if (username.length > 20) {
                res.status(400).send({
                    "error": "Username greater than 20 characters"
                });
                return;
            } else if (req.body.password.length > 128) {
                res.status(400).send({
                    "error": "Password greater than 128 characters"
                });
                return;
            } else if (req.body.password.length < 8) {
                res.status(400).send({
                    "error": "Password less than 8 characters"
                });
                return;
            }
            
            //Hash and salt the password
            let passwordHash = await bcrypt.hash(req.body.password, saltRounds);
            await db.insert("Users", {
                username: username,
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
        })().catch(function(error) {
            //Internal Server Error
            console.log(error);
            res.status(500).send();
        });
    }
});

/**
 * GET /users/:id
 * Gets information about a specific user
 *
 * Returns: 200: JSON Object {
 *              "username": Username of the user
 *          }
 *
 * Returns: 404 (Not Found): User not found
 * 
 */
 router.get("/:id", async function(req, res) {
     try {
         let users = await db.select("Users", ["username"], "id = ?", [req.params.id]);
         if (users.length == 0) {
             res.status(404).send();
             return;
         }
         
         res.status(200).send({
             "username": users[0].username
         });
     } catch (err) {
         console.log(err);
         res.status(500).send();
     }
 });