const express = require('express')
const dashboardRouter = express.Router()
const { getTotalSchool, getTotalStaff, getTotalStudents } = require('../../Controller/dashboardController/dashboardController')
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')


dashboardRouter.get('/totalschools', getTotalSchool)
dashboardRouter.get('/totalstaff', getTotalStaff)
dashboardRouter.get('/totalstudents', getTotalStudents)

module.exports = dashboardRouter