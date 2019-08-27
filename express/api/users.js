const express = require('express');
const db = require('../db/db');
const bcrypt = require('bcrypt');

//bcrypt options
const saltRounds = 12;

let router = express.Router();
router.use(express.json());
module.exports = router;

/**
 * POST /getToken
 * Retrieve a user's token
 * 
 * Body: JSON Object
 *       {
 *           "username": Username of the user of which to retrieve a token,
 *           "password": Password of the user of which to retrieve a token,
 *           "totpCode": Time-based OTP passcode for the user (optional)
 *       }
 *
 * Returns: 200: JSON Object
 *       {
 *           "token": Token of the user,
 *           "id": User ID
 *       }
 *
 * Returns: 403: null
 */
router.post("/getToken", function(req, res) {
    req.send("Endpoint to retrieve a token");
});

/**
 * POST /create
 * Create a user account
 * 
 * Body: JSON Object
 *       {
 *           "username": Username of the new user,
 *           "password": Password of the new user,
 *       }
 *
 * Returns: 200: JSON Object
 *       {
 *           "token": Token of the user,
 *           "id": User ID
 *       }
 *
 * Returns: 400: JSON Object
 *       {
 *           "error": Description of the error
 *       }
 */
router.post("/create", function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({
            "error": "Missing fields"
        });
    } else {
        //Hash (and salt) the password
        bcrypt.hash(req.body.password, saltRounds).then(function(passwordHash) {
            //Insert the user details into the database
            return db.insert("Users", {
                username: req.body.username,
                password: passwordHash
            });
        }).then(function() {
            return db.lastInsertId();
        }).then(function(id) {
            res.status(200).send({
                "token": "toking",
                "id": id
            });
        }).catch(function() {
            //Internal Server Error
            res.status(500).send();
        });
    }
});