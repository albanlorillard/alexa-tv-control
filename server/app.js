
const express = require('express')
const app = express()
const port = 5000
const exec = require('child_process').exec;

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

