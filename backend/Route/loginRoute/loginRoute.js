const express = require('express')
const loginRoute = express.Router()

const { getLoginData, postSignUpData, postLoginData, protectRoute, authorize, getStaffId, updatePassword, createLogin } = require('../../Controller/loginController/loginController')
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')
const { validateSignUpSchema, validateLoginSchema } = require('../../Controller/projectValidations/projectValidations')
const { firebaseLogin } = require('../../Controller/firebaseLoginController/firebaseLoginController')


loginRoute.get('/login', authenticate, authorize("admin"), validateLoginSchema, getLoginData)
loginRoute.post('/userregister', validateSignUpSchema, postSignUpData)
loginRoute.post('/userlogin', postLoginData)
loginRoute.get('/protect', authenticate, protectRoute)
loginRoute.get('/school/:staff_id', getStaffId)
loginRoute.patch('/update/password/:username', updatePassword)
loginRoute.post('/api/auth/firebase-login', firebaseLogin)

module.exports = loginRoute