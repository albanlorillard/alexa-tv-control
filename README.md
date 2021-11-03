# alexa-tv-control

This personnal project be able to control my own not connected Samsung TV from voice thanks to a Raspberry PI with IR transmitter and Alexa

## Setting-Up

### Raspberry Pi configuration

- Plug-in IR transmitter at PIN 17
- Configure Lirc in Raspberry
- Found your IR mapping or record it with an IR receiver on an other PIN

### Raspberry nodejs server & connexion

- cd server
- npm install
- npm run start
- configure & install ngrok
- run ngrok on server port

### Alexa Developper kit

- Copy ./aws/skill.json inside Build > Intents > Json editor of the Alexa skill developper console
- Build model
- Copy lambda inside code content. Adapt process.env.RASPBERRY_BASEURL with ngrok https url.
- Build code
- Test