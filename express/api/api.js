const express = require('express');
const users = require('./users');

let router = express.Router();
module.exports = router;

router.use("/users", users);