const express = require('express');
const fs = require('fs');
const db = require('../db/db');
const settings = require('../settings');
const tokens = require('./helpers/token');
const resources = require('./helpers/resources');

let router = express.Router();
module.exports = router;

async function createPost(req, res, postId = null) {
    if (!req.body.image || !req.body.mime) {
        res.status(400).send({
            "error": "Missing fields"
        });
    } else {
        let t = db.transaction();
        try {
            let userRows = await tokens.getUser(req);
            
            //Put the resource into the filesystem
            let resource = await resources.putResource(Buffer.from(req.body.image, 'base64'), req.body.mime);
            
            //Add a new post to the database
            await db.insert("posts", {
                userId: userRows[0].id,
                image: resource.id,
                deleted: 0
            });
            
            let newPostId = await db.lastInsertId();
            
            if (postId != null) {
                //Make this post a reply
                await db.insert("comments", {
                    id: newPostId,
                    replyTo: postId
                });
            }
            
            t.commit();
            res.status(200).send({
                id: newPostId
            });
        } catch (e) {
            t.discard();
            if (e.message == "Invalid Token") {
                //Invalid token or no one logged in
                res.status(401).send();
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
}

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
 * GET /posts/new
 * Gets posts ordered by date
 *
 * Returns: 200: JSON Array [
 *              Post IDs for each new post
 *          ]
 *
 */
 router.get("/new", async function(req, res) {
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
    createPost(req, res, null);
});

/**
 * GET /posts/:id
 * Gets information about a specific post
 *
 * Returns: 200: JSON Object {
 *              "user": ID of the user associated with this post
 *              "image": URL to image located on the server, or null if the post has been deleted
 *              "id": ID of this post,
 *              "comments": JSON Array [
 *                  Post IDs of each reply to this post
 *              ],
 *              "parent": Post ID of the parent for this post, or null if this is a top level post,
 *              "deleted": true if deleted, false if not
 *          }
 *
 * Returns: 404 (Not Found): Post not found
 * 
 * Returns: 410 (Gone): Post deleted by user
 * 
 */
 router.get("/:id", async function(req, res) {
     try {
         let posts = await db.select("Posts", ["userId", "image", "deleted"], "id = ?", [req.params.id]);
         if (posts.length == 0) {
             res.status(404).send();
             return;
         }
         
         let post = posts[0];
         let deleted = post.deleted != 0;
         
         let resource = await resources.getResource(post.image);
         if (resource == null) {
             res.status(500).send();
             return;
         }
         let image = `${settings.get('resourcesPublicDir')}/${resource}`;
         if (deleted) image = null;
         
         let comments = await db.select("Comments", ["id"], "replyTo = ?", [req.params.id]);
         let commentsReply = [];
         for (let comment of comments) {
             commentsReply.push(comment.id);
         }
         
         let parent = await db.select("Comments", ["replyTo"], "Comments.id = ?", [req.params.id])
         let parentReply = parent.length == 0 ? null : parent[0].replyTo;
         
         //TODO: Also send back comments and reactions
         
         res.status(200).send({
             "user": post.userId,
             "image": image,
             "id": req.params.id,
             "comments": commentsReply,
             "parent": parentReply,
             "deleted": deleted
         });
     } catch (err) {
         console.log(err);
         res.status(500).send();
     }
 });
 
/**
 * POST /posts/:id
 * Reply to a post
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
router.post("/:id", async function(req, res) {
    createPost(req, res, req.params.id);
});

/**
 * DELETE /posts/:id
 * Delete a post
 * Requires authentication
 *
 * Returns: 204 (No Content): Success
 *
 * Returns: 401 (Unauthorized): Either the user is not the poster, or an invalid token was provided
 *
 * Returns: 404 (Not Found): Post not found
 */
router.delete("/:id", async function(req, res) {
    let t = db.transaction();
    try {
        let userRows = await tokens.getUser(req);
        let posts = await db.select("Posts", ["userId", "deleted"], "id = ?", [req.params.id]);
        if (posts.length == 0) {
             res.status(404).send();
             t.discard();
             return;
        }
        
        if (posts[0].deleted != 0) {
            res.status(404).send();
            t.discard();
            return;
        }
        
        if (posts[0].userId != userRows[0].id) {
            res.status(401).send();
            t.discard();
            return;
        }
        
        let comments = await db.select("Comments", ["id"], "replyTo = ?", [req.params.id]);
        if (comments.length == 0) {
            //Just delete the post
            db.delete("Posts", "id = ?", [req.params.id]);
        } else {
            //Modify the post to state that it is deleted
            db.update("Posts", {
                deleted: 1
            }, "id = ?", [req.params.id]);
        }
        
        t.commit();
        res.status(204).send();
    } catch (e) {
        t.discard();
        if (e.message == "Invalid Token") {
            //Invalid token or no one logged in
            res.status(401).send();
        } else {
            console.log(e);
            res.status(500).send();
        }
    }
});