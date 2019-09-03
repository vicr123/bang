const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const api = require('./api/api');

app.use(express.json());

app.get("/api/working", function(req, res) {
    res.send("yes");
});

app.use('/api', api);

app.use(express.static(path.normalize(`${process.cwd()}/../react/build/`), {
    //options go here
}));

app.get('*', function(request, response) {
    response.sendFile(path.normalize(`${process.cwd()}/../react/build/index.html`));
});

app.listen(port, () => {
    console.log(`Locked and loaded! Head to http://127.0.0.1:${port}/ to get started!`)
});