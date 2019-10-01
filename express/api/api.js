const express = require('express');
const db = require('../db/db');

const users = require('./users');
const posts = require('./posts');

let router = express.Router();
module.exports = router;

router.use("/users", users);
router.use("/posts", posts);


/**
 * GET /leaderboard
 * Gets the top 10 users (based on reactions)
 *
 * Returns: 200: JSON Array [
 *              User IDs of each user
 *          ]
 * 
 */
router.get("/leaderboard", async function(req, res) {
    let counts = await db.select("Reactions", ["COUNT(*) AS count", "userId"], "1=1", [], "GROUP BY userId ORDER BY count DESC LIMIT 10");
    let response = [];
    for (let row of counts) {
        response.push(row.userId);
    }

    res.status(200).send(response);
});
