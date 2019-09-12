const express = require('express');
const db = require('../db/db');

let router = express.Router();
router.use(express.json());
module.exports = router;

/**
 * GET /posts/trending
 * Gets trending posts
 *
 * Returns: 200: JSON Array [
 *              Post IDs for each trending post
 *          ]
 *
 */

 router.get("/trending", function(req, res) {
     res.status(200).send([
         0, 1, 2, 3
     ]);
 });
 
/**
 * POST /posts/create
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

/**
 * GET /posts/:id
 * Gets information about a specific post
 *
 * Returns: 200: JSON Object {
                
 *          }
 *
 * Returns: 404 (Not Found): Post not found
 * 
 */
 router.get("/:id", function(req, res) {
     res.status(200).send({
         "ok": "ok"
     });
 });