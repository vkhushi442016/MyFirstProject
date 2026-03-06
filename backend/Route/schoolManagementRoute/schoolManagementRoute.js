const express = require('express')
const schoolRouter = express.Router()
const {getData, postSchoolData, getSchoolNameFilter, applyPagination} = require('../../Controller/schoolManagementController/schoolManagementController')
const {validateSchoolDetailSchema} = require('../../Controller/projectValidations/projectValidations')
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')

schoolRouter.get('/schoolmanagement', getData)
schoolRouter.post('/schooldetail', validateSchoolDetailSchema, postSchoolData)
schoolRouter.get('/searchschool', getSchoolNameFilter)
schoolRouter.get('/schoolmanpagination', applyPagination)

module.exports = schoolRouter