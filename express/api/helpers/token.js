const express = require("express");
const db = require("../../db/db");

module.exports = {
	getUser: async function(req) {
		let token = req.get("Authorization");

		if (!token || !token.startsWith("Token ")) {
			throw new Error("Invalid Token");
		}
		token = token.substr(6); // ignore the Early Token subtring

		//Retrieve the user ID from the database
		let rows = await db.select("Tokens", ["userId"], "TOKEN = ?", [token]);
		if (rows.length == 0) {
			throw new Error("Invalid Token");
		}

		let row = rows[0];

		//Retrieve the user from the database
		return await db.select("Users", ["id", "username"], "ID = ?", [
			row.userId
		]);
	}
};
