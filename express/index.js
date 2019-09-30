const server = require('./server');

let port = "3000";
if (process.argv.indexOf("--port") != -1) {
    port = process.argv[process.argv.indexOf("--port") + 1];
}

server.runServer({port: port});