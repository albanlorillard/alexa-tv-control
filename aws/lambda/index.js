const https = require('https')
const Alexa = require('ask-sdk-core');


const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {

        //const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        

        const commandkey = handlerInput.requestEnvelope.request.intent.slots.command.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        console.log(Alexa.getRequestType(handlerInput.requestEnvelope));

        const speakOutput = `Vous venez d'effectuer la commande ${commandkey}`;

        https.get(`${process.env.RASPBERRY_BASEURL}/${commandkey}`, res => {
        }).on('error', err => {
          console.log(err.message);
        })

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Mes excuses, je n\'ai pas compris la commande à transmettre à la télé';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();