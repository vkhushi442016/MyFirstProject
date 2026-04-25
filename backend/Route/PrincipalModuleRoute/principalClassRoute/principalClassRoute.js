const express = require('express')
const classRoute = express.Router()
const { getClassSyllabusDetail } = require('../../../Controller/PrincipalController/PrincipalClassController/PrincipalClassController')

classRoute.get('/api/class/syllabus/:dise_code', getClassSyllabusDetail)

module.exports = classRoute