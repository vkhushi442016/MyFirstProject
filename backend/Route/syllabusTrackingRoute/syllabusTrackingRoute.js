const express = require('express')
const syllabusTrackingRoute = express.Router();
const { getSyllabusData, getSyllabusDataMiddleSchool, getSyllabusDataHigherSchool } = require('../../Controller/syllabusTrackingController/syllabusTrackingController')

syllabusTrackingRoute.get('/syllabusdata', getSyllabusData);
syllabusTrackingRoute.get('/syllabusdatamiddleschool', getSyllabusDataMiddleSchool);
syllabusTrackingRoute.get('/syllabusdatahs', getSyllabusDataHigherSchool);



module.exports = syllabusTrackingRoute