const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const api = require("./api/api");
const fs = require("fs");
const db = require("./db/db");

const settings = require("./settings");

module.exports = {
	runServer: function(options = {}) {
		return new Promise(function(res, rej) {
			if (!options.port) options.port = 3000;
			if (!options.db) options.db = {};

			settings.set("resourcesDir", `${process.cwd()}/resources/`);
			settings.set("resourcesPublicDir", "/resources");

			//Make directories required
			if (!fs.existsSync(settings.get("resourcesDir"))) {
				fs.mkdirSync(settings.get("resourcesDir"));
			}

			//Initialize the database
			db.initialize(options.db);

			// Maximum requests body size
			app.use(
				express.json({
					limit: "10mb"
				})
			);

			app.use("/api", api);

			app.use(
				express.static(
					path.normalize(`${process.cwd()}/../react/build/`),
					{
						//options go here
					}
				)
			);
			app.use(
				settings.get("resourcesPublicDir"),
				express.static(settings.get("resourcesDir"), {
					//options go here
				})
			);
			// deliver the front end
			app.get("*", function(request, response) {
				response.sendFile(
					path.normalize(`${process.cwd()}/../react/build/index.html`)
				);
			});
			// start the server
			app.listen(options.port, err => {
				if (err) {
					console.log("Couldn't prepare the server");
					rej(err);
				} else {
					console.log(
						`Locked and loaded! Head to http://127.0.0.1:${options.port}/ to get started!`
					);
					res(app);
				}
			});
		});
	}
};
