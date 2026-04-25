const express = require('express')
const dashboardRouter = express.Router()
const { getTotalSchool, getTotalStaff, getTotalStudents, getUserProfile, getSyllabusDataFromSchoolDetails, 
    getPast30DaysSchoolCount,
    getPast30DaysStaffCount } = require('../../Controller/dashboardController/dashboardController')
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')
const {authorize} = require('../../Controller/loginController/loginController')

dashboardRouter.get('/totalschools', getTotalSchool)
dashboardRouter.get('/totalstaff', getTotalStaff)
dashboardRouter.get('/totalstudents', getTotalStudents)
dashboardRouter.get('/user/profile/:id', getUserProfile)
dashboardRouter.get('/barchart/data', getSyllabusDataFromSchoolDetails)
dashboardRouter.get('/past-month/staff-count', getPast30DaysStaffCount)
dashboardRouter.get('/past-month/school-count', getPast30DaysSchoolCount)





module.exports = dashboardRouter