var fs = require('fs');
const express = require('express')
const app = express()
const PORT = 1994
const exec = require('child_process').exec;
const https = require('https');
const http = require('http');

var privateKey  = fs.readFileSync('./sslcert/privkey.pem');
var certificate = fs.readFileSync('./sslcert/cert.pem');

var credentials = {key: privateKey, cert: certificate};

app.get('/:command', (req, res) => {
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

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT);
httpServer.listen(1995);
