const express = require('express')
const calendarRoute = express.Router()
const { getEvents, postEvent, deleteEvent } = require('../../Controller/AcademicCalendarController/AcademicCalendarController')

calendarRoute.get('/schoolevent', getEvents)
calendarRoute.post('/schoolevent', postEvent)
calendarRoute.delete('/schoolevent/:id', deleteEvent)

module.exports = calendarRoute