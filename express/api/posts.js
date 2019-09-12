const express = require('express');
const fs = require('fs');
const db = require('../db/db');
const settings = require('../settings');
const tokens = require('./helpers/token');
const resources = require('./helpers/resources');

let router = express.Router();
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
 * Requires authentication
 * 
 * Body: JSON Object {
 *           "image": base64 encoded image data,
 *           "mime": MIME type of encoded image data
 *       }
 *
 * Returns: 200: JSON Object {
 *              "id": Post ID
 *          }
 *
 * Returns: 400: JSON Object {
 *              "error": Description of the error
 *          }
 */
router.post("/create", function(req, res) {
    if (!req.body.image || !req.body.mime) {
        res.status(400).send({
            "error": "Missing fields"
        });
    } else {
        (async function() {
            try {
                let userRows = await tokens.getUser(req);
                
                //Put the resource into the filesystem
                let resource = resources.putResource(Buffer.from(req.body.image, 'base64'), req.body.mime);
                
                res.status(200).send({
                    id: 5
                });
            } catch (e) {
                if (e.message == "Invalid Token") {
                    //Invalid token or no one logged in
                    res.status(403).send();
                } else if (e.message == "Mimetype not resolvable") {
                    res.status(400).send({
                        "error": "Invalid Mimetype"
                    });
                } else {
                    console.log(e);
                    res.status(500).send();
                }
            }
        })();
    }
});

/**
 * GET /posts/:id
 * Gets information about a specific post
 *
 * Returns: 200: JSON Object {
                "image": URL to image located on the server
 *          }
 *
 * Returns: 404 (Not Found): Post not found
 * 
 */
 router.get("/:id", function(req, res) {
     res.status(200).send({
         "ok": `${settings.get('resourcesPublicDir')}/image.jpg`,
         "id": req.params.id
     });
 });