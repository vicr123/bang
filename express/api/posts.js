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
    if (!req.body.image || !req.body.mime) {
        res.status(400).send({
            "error": "Missing fields"
        });
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
 *              "comments": JSON Array [ JSON Object {
 *                  "image": Image URL for this comment
 *                  "id": Post ID for this comment
 *              }],
 *              "parent": Post ID of the parent for this post, or null if this is a top level post,
 *              "reactions": JSON Object {
 *                  "reaction": Emoji of the reaction,
 *                  "count": Number of people to react with this reaction
 *              },
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
             let commentPosts = await db.select("Posts", ["image", "deleted"], "id = ?", [comment.id]);
             if (commentPosts.length == 0) {
                 //Ignore
             } else {
                 let resource = await resources.getResource(commentPosts[0].image);
                 
                 let commentReply = {
                     id: comment.id,
                     image: commentPosts[0].deleted == 0 ? `${settings.get('resourcesPublicDir')}/${resource}` : null
                 };
                 
                 commentsReply.push(commentReply);
             }
         }
         
         let parent = await db.select("Comments", ["replyTo"], "Comments.id = ?", [req.params.id])
         let parentReply = parent.length == 0 ? null : parent[0].replyTo;
         
         let reactions = await db.select("Reactions", ["COUNT(*) AS c", "emoji"], "postId = ?", [req.params.id], "GROUP BY emoji");
         let reactionsReply = {};
         for (let reaction of reactions) {
             reactionsReply[reaction.emoji] = reaction.c;
            //  reactionsReply.push({
            //      "reaction": reaction.emoji,
            //      "count": reaction.c
            //  });
         }
         
         res.status(200).send({
             "user": post.userId,
             "image": image,
             "id": req.params.id,
             "comments": commentsReply,
             "parent": parentReply,
             "reactions": reactionsReply,
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
 * Returns: 400 (Bad Request): JSON Object {
 *              "error": Description of the error
 *          }
 */
router.post("/:id", async function(req, res) {
    createPost(req, res, req.params.id);
});

/**
 * PATCH /posts/:id
 * Edit a post
 * Requires authentication
 *
 * Body: JSON Object {
 *           "image": base64 encoded image data,
 *           "mime": MIME type of encoded image data
 *       }
 *
 * Returns: 204 (No Content): Success
 *
 * Returns: 400 (Bad Request): JSON Object {
 *              "error": Description of the error
 *          }
 *
 * Returns: 401 (Unauthorized): Either the user is not the poster, or an invalid token was provided
 *
 * Returns: 404 (Not Found): Post not found
 */
router.patch("/:id", async function(req, res) {
    if (!req.body.image || !req.body.mime) {
        res.status(400).send({
            "error": "Missing fields"
        });
        return;
    }
    
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
        if (comments.length != 0) {
            //This post has a comment so it can't be edited
            res.status(400).send({
                "error": "Post has been commented on"
            });
            t.discard();
            return;
        }

        //TODO: Ensure there are no reactions
        
        //Put the resource into the filesystem
        let resource = await resources.putResource(Buffer.from(req.body.image, 'base64'), req.body.mime);
        
        //Edit the post in the database
        await db.update("posts", {
            image: resource.id
        }, "id = ?", [req.params.id]);
        
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

/**
 * POST /posts/:id/reactions
 * React to a post
 * Requires authentication
 * 
 * Body: JSON Object {
 *           "reaction": Reaction to edit,
 *           "add": true to add the reaction, false to remove
 *       }
 *
 * Returns: 204 (No Content): Success
 *
 * Returns: 400: JSON Object {
 *              "error": Description of the error
 *          }
 */
router.post("/:id/reactions", async function(req, res) {
    if (!req.body.reaction || !req.body.add) {
        res.status(400).send({
            "error": "Missing fields"
        });
    } else {
        let t = db.transaction();
        try {
            let userRows = await tokens.getUser(req);
            let posts = await db.select("Posts", ["id", "userId", "deleted"], "id = ?", [req.params.id]);
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
            
            //TODO: Ensure the reaction is a valid emoji
            
            if (req.body.add) {
                let reactions = await db.select("Reactions", ["emoji"], "postId = ? AND userId = ? AND emoji = ?", [posts[0].id, userRows[0].id, req.body.reaction]);
                if (reactions.length != 0) {
                    res.status(400).send({
                        error: "Reaction already exists"
                    });
                }
                
                await db.insert("Reactions", {
                    postId: posts[0].id,
                    userId: userRows[0].id,
                    emoji: req.body.reaction
                });
            } else {
                //TODO: Delete reactions
                res.status(501).send();
                t.discard();
                return;
            }
            
            t.commit();
            res.status(204).send();
        } catch (e) {
            t.discard();
            if (e.message == "Invalid Token") {
                //Invalid token or no one logged in
                res.status(403).send();
            } else {
                console.log(e);
                res.status(500).send();
            }
        }
    }
});