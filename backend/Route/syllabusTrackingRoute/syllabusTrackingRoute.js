const express = require('express')
const syllabusTrackingRoute = express.Router();
const { getSyllabusData, getSyllabusDataMiddleSchool, getSyllabusDataHigherSchool, getSubjectWiseSyllabus, getClasses, getSubjects, postSubjectWiseSyllabus, postNewSubject, deleteTopic } = require('../../Controller/syllabusTrackingController/syllabusTrackingController')
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')

syllabusTrackingRoute.get('/syllabusdata', getSyllabusData);
syllabusTrackingRoute.get('/syllabusdatamiddleschool', getSyllabusDataMiddleSchool);
syllabusTrackingRoute.get('/syllabusdatahs', getSyllabusDataHigherSchool);
syllabusTrackingRoute.get('/topics/:subject_id', getSubjectWiseSyllabus)
syllabusTrackingRoute.get('/classes', getClasses)
syllabusTrackingRoute.get('/subject/:class_id', getSubjects)
syllabusTrackingRoute.post('/add/syllabus', postSubjectWiseSyllabus)
syllabusTrackingRoute.post('/classes/:class_id/subjects', postNewSubject)
syllabusTrackingRoute.delete('/delete/:subject_id/:topic', deleteTopic)




module.exports = syllabusTrackingRoute