const express = require('express');
const notificationRoute = express.Router(); 

const { getStaffData, sendNotificationByRole } = require('../../Controller/notificationController/notificationController');

notificationRoute.get('/api/staff', getStaffData)
notificationRoute.post('/notifications/send', sendNotificationByRole)

module.exports = notificationRoute