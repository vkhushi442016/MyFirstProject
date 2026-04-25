const express = require('express')
const whatsAppRoute = express.Router();

const {sendWhatsAppToPrincipals, sendMessages} = require('../../Controller/whatsAppChatIntegrationTwilio/whatsAppChatIntegrationTwilio')

whatsAppRoute.post('/send-whatsapp', sendWhatsAppToPrincipals)
whatsAppRoute.post('/api/send/sms', sendMessages);


module.exports = whatsAppRoute;