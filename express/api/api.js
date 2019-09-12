const express = require('express');

const users = require('./users');
const posts = require('./posts');

let router = express.Router();
module.exports = router;

router.use("/users", users);
router.use("/posts", posts);