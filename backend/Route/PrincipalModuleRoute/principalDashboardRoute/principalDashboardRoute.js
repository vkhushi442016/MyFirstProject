const express = require('express')
const pDashboardStaffRoute = express.Router()
const { getTotalStaffCount, getTotalStudentCount,getClassWiseStats } = require("../../../Controller/PrincipalController/principalDashboardController/principalDashboardController")

pDashboardStaffRoute.get('/api/staff/:diseCode', getTotalStaffCount)
pDashboardStaffRoute.get('/api/students/:school_id', getTotalStudentCount)
pDashboardStaffRoute.get('/api/class-wise-stats/:dise_code', getClassWiseStats);

module.exports = pDashboardStaffRoute