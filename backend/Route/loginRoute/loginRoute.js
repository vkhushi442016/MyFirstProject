const express = require('express')
const loginRoute = express.Router()

const { getLoginData, postSignUpData, postLoginData, protectRoute } = require('../../Controller/loginController/loginController')
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')
const { validateSignUpSchema, validateLoginSchema } = require('../../Controller/projectValidations/projectValidations')

loginRoute.get('/login', authenticate, validateLoginSchema, getLoginData)
loginRoute.post('/userregister', validateSignUpSchema, postSignUpData)
loginRoute.post('/userlogin', postLoginData)
loginRoute.get('/protect', authenticate, protectRoute)

module.exports = loginRoute