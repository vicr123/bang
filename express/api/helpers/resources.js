const express = require("express");
const fs = require("fs");
const util = require("util");
const db = require("../../db/db");
const settings = require("../../settings");
const crypto = require("crypto");
const mimetoext = require("mime-to-extensions");

const writeFile = util.promisify(fs.writeFile); // makes writing a file return a promise
/**
 * returns a random file name with a 16byte hexadecimal number
 * @param {} extension file name extension to be added to the end of the new file
 * @returns {} fn filename
 */
async function getRandomFileName(extension) {
	let fn;
	do {
		fn = `${crypto.randomBytes(16).toString("hex")}.${extension}`;
	} while (fs.existsSync(`${settings.get("resourcesPublicDir")}/${fn}`));

	return fn;
}

module.exports = {
	putResource: async function(data, mimetype) {
		// get the extension from the mime to extension package
		let extension = mimetoext.extension(mimetype);
		if (extension == false) throw new Error("Mimetype not resolvable");

		let randomFileName = await getRandomFileName(extension);
		// create the file
		await writeFile(
			`${settings.get("resourcesDir")}/${randomFileName}`,
			data
		);
		// insert a reference to the resource in the database
		await db.insert("Resources", {
			filename: randomFileName
		});

		//Return the file ID and file name
		return {
			id: await db.lastInsertId(),
			filename: randomFileName
		};
	},
	getResource: async function(id) {
		let rows = await db.select("Resources", ["filename"], "id = ?", [id]);
		if (rows.length == 0) {
			return null;
		} else {
			return rows[0].filename;
		}
	}
};
