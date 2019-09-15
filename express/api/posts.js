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

 router.get("/trending", async function(req, res) {
     let rows = await db.select("Posts", ["id"], "1=1", [], "ORDER BY id DESC");
     
     let response = [];
     for (let row of rows) {
         response.push(row.id);
     }
     res.status(200).send(response);
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
router.post("/create", async function(req, res) {
    if (!req.body.image || !req.body.mime) {
        res.status(400).send({
            "error": "Missing fields"
        });
    } else {
        try {
            let userRows = await tokens.getUser(req);
            
            //Put the resource into the filesystem
            let resource = await resources.putResource(Buffer.from(req.body.image, 'base64'), req.body.mime);
            
            //Add a new post to the database
            await db.insert("posts", {
                userId: userRows[0].id,
                image: resource.id
            });
            
            res.status(200).send({
                id: await db.lastInsertId()
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
    }
});

/**
 * GET /posts/:id
 * Gets information about a specific post
 *
 * Returns: 200: JSON Object {
 *              "user": ID of the user associated with this post
 *              "image": URL to image located on the server
 *              "id": ID of this post
 *          }
 *
 * Returns: 404 (Not Found): Post not found
 * 
 */
 router.get("/:id", async function(req, res) {
     let posts = await db.select("Posts", ["userId", "image"], "id = ?", [req.params.id]);
     if (posts.length == 0) {
         res.status(404).send();
         return;
     }
     
     let post = posts[0];
     let resource = await resources.getResource(post.image);
     if (resource == null) {
         res.status(500).send();
     }
     
     //TODO: Also send back comments and reactions
     
     res.status(200).send({
         "user": post.userId,
         "image": `${settings.get('resourcesPublicDir')}/${resource}`,
         "id": req.params.id
     });
 });