require('dotenv').config({path: __dirname + '/.env'})

const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express')
const exec = require('child_process').exec;
const axios = require('axios');

// Securize server
const helmet = require("helmet");
const cors = require('cors');

// Log
const morgan = require('morgan');

const app = express();

var privateKey  = fs.readFileSync(process.env.SSL_PRIVKEY);
var certificate = fs.readFileSync(process.env.SSL_CERT);

var credentials = {key: privateKey, cert: certificate};

function isRequestValid(req) {
    const regex = /^KEY_[A-Z0-9]{1,16}$/;
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
        res.sendStatus(403);
        return null;
    }

    next();
});

app.get('/:command', (req, res) => {

    if (!isRequestValid(req)) {
        res.sendStatus(400);
        return null;
    }

    const command = req.params.command;

    if (command === "KEY_POWER") {
        exec('irsend send_once SAMSUNG_AA59-00600A_POWER KEY_POWER');
    } else if (command.startsWith("KEY_")) {
        exec('irsend send_once SAMSUNG_AA59-00600A '+command);
    } else {
        res.send('Malformed command', 403);
        return;
    }
    
    res.send('OK!', 200)
})

app.get('/pihole/:seconds', (req, res) => {
	const isNumeric = (str) => {
  		if (typeof str != "string") return false;
  		return !isNaN(str) && !isNaN(parseInt(str));
	}
	if (!isNumeric(req.params.seconds)) {
		res.sendStatus(400);
		return;
	}

	axios.get(`${process.env.PIHOLE_BASEURL}/admin/api.php?disable=${req.params.seconds}&auth=${process.env.PIHOLE_PW}`)
		.then((_) => { console.log("Désactivation du PIHole OK!"); res.sendStatus(200); })
		.catch((err) => { console.log(`Erreur : ${err}`); res.sendStatus(400); });
})


const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT_HTTPS, () => {
    console.log(`IR sender app listening on https://localhost:${process.env.PORT_HTTPS}`)
});

httpServer.listen(process.env.PORT_HTTP, () => {
    console.log(`IR sender app listening on http://localhost:${process.env.PORT_HTTP}`)

});
module.exports = app;
