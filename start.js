const blessed = require('blessed');
const child = require('child_process');

let processes = {};

let screen = blessed.screen({
    smartCSR: true
});

let titleBox = blessed.box({
    width: '100%',
    height: 1,
    top: 0,
    left: 0,
    content: '!Bang 0.1',
    style: {
        fg: 'black',
        bg: 'white'
    }
});
screen.append(titleBox);

let infoBox = blessed.box({
    top: "100%-1",
    left: "0",
    width: "100%",
    height: 1,
    style: {
        fg: 'black',
        bg: 'white'
    }
});
screen.append(infoBox);

let closeButton = blessed.button({
    style: {
        fg: 'yellow',
        bg: 'blue'
    },
    content: '^C Exit',
    left: 1,
    width: 7,
    height: 1,
    top: '100%-1'
});
screen.append(closeButton);

let buildButton = blessed.button({
    style: {
        fg: 'yellow',
        bg: 'blue'
    },
    content: '^B Build',
    left: 9,
    width: 8,
    height: 1,
    top: '100%-1'
});
screen.append(buildButton);

let bootstrapButton = blessed.button({
    style: {
        fg: 'yellow',
        bg: 'blue'
    },
    content: '^W Bootstrap',
    left: 18,
    width: 12,
    height: 1,
    top: '100%-1'
});
screen.append(bootstrapButton);

let status = blessed.text({
    left: 31,
    width: 30,
    height: 1,
    top: '100%-1',
    style: {
        fg: 'green',
        bg: 'white'
    },
    content: "Preparing..."
});
screen.append(status);

let restartExpressButton = blessed.button({
    style: {
        fg: 'yellow',
        bg: 'blue'
    },
    content: '^R Restart Express',
    left: '100%-19',
    width: 18,
    height: 1,
    top: '100%-1'
});
screen.append(restartExpressButton);

let expressLog = blessed.log({
    left: 0,
    width: '100%',
    height: '100%-2',
    top: 1,
    tags: true
});
screen.append(expressLog);

let infoLog = blessed.log({
    left: 0,
    width: '50%',
    height: '50%',
    top: '50%-1',
    tags: true,
    border: {
        type: 'line'
    }
})
screen.append(infoLog);
infoLog.hide();

function shutdown() {
    if (processes.express != null) {
        //Terminate the old process and clear the log
        processes.express.kill();
    }
    process.exit(0);
}

function attachInfoLog(proc, title) {
    infoLog.setLabel({
        text: title,
        side: 'left'
    });
    infoLog.setContent("");
    
    infoLog.show();
    proc.stdout.on('data', (data) => {
        infoLog.log(data.toString());
    })
    proc.stderr.on('data', (data) => {
        infoLog.log(data.toString());
    });
    proc.on('close', (code) => {
        status.setContent("Ready!");
        if (code == 0) {
            infoLog.hide();
        } else {
            infoLog.log(`{red-fg}Process exited with code ${code}{/red-fg}`);
            infoLog.log(`{red-fg}Scroll this box with ^Up and ^Down.{/red-fg}`);
            infoLog.log(`{red-fg}Hit ^Z to close this box.{/red-fg}`);
        }
        screen.render();
    })
}

function build() {
    if (processes.info != null) {
        //Terminate the old process and clear the log
        processes.info.kill();
    }
    
    status.setContent("Building React...");
    processes.info = child.spawn("npm", ["run", "build"], {
        cwd: process.cwd() + "/react"
    });
    attachInfoLog(processes.info, "Build");
}

function bootstrap() {
    if (processes.info != null) {
        //Terminate the old process and clear the log
        processes.info.kill();
    }
    
    status.setContent("Bootstrapping Project...");
    processes.info = child.spawn("./bootstrap.sh", [], {
        cwd: process.cwd()
    });
    attachInfoLog(processes.info, "Bootstrap");
}

function startExpress() {
    status.setContent("Starting Express...");
    if (processes.express != null) {
        //Terminate the old process and clear the log
        processes.express.kill();
        expressLog.setContent("");
    }
    
    processes.express = child.spawn("node", ["index.js"], {
        cwd: process.cwd() + "/express"
    });
    processes.express.stdout.on('data', (data) => {
        expressLog.log(data.toString());
    })
    processes.express.stderr.on('data', (data) => {
        expressLog.log(data.toString());
    });
    
    status.setContent("Ready!");
}

screen.key(['q', 'C-c'], shutdown);
screen.key(['C-b'], build);
screen.key(['C-w'], bootstrap);
screen.key(['C-r'], startExpress);
screen.key(['C-z'], function() {
    infoLog.hide();
    screen.render();
});
screen.key(['C-up'], function() {
    infoLog.scroll(-1);
});
screen.key(['C-down'], function() {
    infoLog.scroll(1);
});
screen.key(['up'], function() {
    expressLog.scroll(-1);
});
screen.key(['down'], function() {
    expressLog.scroll(1);
});
closeButton.on('click', shutdown);
buildButton.on('click', build);
bootstrapButton.on('click', bootstrap);
restartExpressButton.on('click', startExpress);

startExpress();

screen.render();