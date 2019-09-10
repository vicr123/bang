const express = require('express');
const db = require('../db/db');

let router = express.Router();
router.use(express.json());
module.exports = router;

/**
 * POST /create
 * Create a new post
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
    
});