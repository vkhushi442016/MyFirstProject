const express = require('express')
const pStaffRoute = express.Router()
const {getStaffData } = require('../../Controller/PrincipalController/principalStaffDirectoryController/principalStaffDirectoryController')

pStaffRoute.get('/api/disecode/:dise_code', getStaffData)

module.exports = pStaffRoute