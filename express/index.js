const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const api = require('./api/api');
const fs = require('fs');

const settings = require('./settings');
settings.set('resourcesDir', `${process.cwd()}/resources/`);
settings.set('resourcesPublicDir', "/resources");

//Make directories required
if (!fs.existsSync(settings.get('resourcesDir'))) {
    fs.mkdirSync(settings.get('resourcesDir'));
}

app.use(express.json({
    limit: "10mb"
}));

app.get("/api/working", function(req, res) {
    res.send("yes");
});

app.use('/api', api);

app.use(express.static(path.normalize(`${process.cwd()}/../react/build/`), {
    //options go here
}));
app.use(settings.get('resourcesPublicDir'), express.static(settings.get('resourcesDir'), {
    //options go here
}));

app.get('*', function(request, response) {
    response.sendFile(path.normalize(`${process.cwd()}/../react/build/index.html`));
});

app.listen(port, () => {
    console.log(`Locked and loaded! Head to http://127.0.0.1:${port}/ to get started!`)
});