require('dotenv').config({path: __dirname + '/.env'})
const express = require('express')
const app = express()
const port = 1994

// Securize server
const helmet = require("helmet");
const cors = require('cors');

// Log
const morgan = require('morgan');

const exec = require('child_process').exec;

function isRequestValid(req) {
    const regex = /^KEY_[A-Z]{3,16}$/;
    return Object.keys(req.params).length == 1 
    && regex.test(req.params.command) 
    && req.params.command.length < 16;
}

app.use(helmet());
app.use(morgan('combined'));
app.use(cors());

app.use( (req, res, next) => {

    const apiKeys = JSON.parse(process.env.API_KEYS ?? '[]');

    if (!apiKeys.includes(req.headers['x-api-key'])) {
        res.send(403);
        return null;
    }

    next();
});

app.get('/:command', (req, res) => {

    if (!isRequestValid(req)) {
        res.send(400);
        return null;
    }

    const command = req.params.command;

    if (command === "KEY_POWER") {
        exec('irsend send_once SAMSUNG_POWER KEY_POWER');
    } else if (command.startsWith("KEY_")) {
        exec('irsend send_once SAMSUNG '+command);
    } else {
        res.send('Malformed command', 403);
        return;
    }
    
    res.send('OK!', 200)
})

app.listen(port, () => {
    console.log(`IR sender app listening on http://localhost:${port}`)
})

module.exports = app;