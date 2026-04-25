const express = require('express')
const schoolRouter = express.Router()

const { getData, postSchoolData, getSchoolNameFilter, sendAlert} = require('../../Controller/schoolManagementController/schoolManagementController')
const { validateSchoolDetailSchema } = require('../../Controller/projectValidations/projectValidations')
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')

const applyPaginations = require('../../Controller/Pagination/Pagination')

const connection = require('../../Model/dbConnect')
const paginateSchoolManagement = applyPaginations(connection)("schools_detail", "schoolName");

schoolRouter.get('/schoolmanagement', authenticate, getData)
schoolRouter.post('/schooldetail', validateSchoolDetailSchema, postSchoolData)
schoolRouter.get('/searchschool', getSchoolNameFilter);
schoolRouter.get('/trigger-alert', sendAlert);


module.exports = schoolRouter