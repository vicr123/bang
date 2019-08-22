const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.get("/api/working", function(req, res) {
    res.send("yes");
});

app.use(express.static(path.normalize(`${process.cwd()}/../react/build/`), {
    
}));

app.listen(port, () => {
    console.log(`Locked and loaded! Head to http://127.0.0.1:${port}/ to get started!`)
});