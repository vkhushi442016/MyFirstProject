const express = require('express')
const studentsRouter = express.Router();

const {getStudentsData, updateStudentData, postStudentData} = require('../../../Controller/TeacherController/StudentsController/studentsController')

const upload = require('../../../Controller/multer')


studentsRouter.get('/api/students-data/:school_id', getStudentsData)
studentsRouter.post('/api/students-data', postStudentData)
studentsRouter.patch('/api/update-student/:student_id', upload.single('image'), updateStudentData)




module.exports = studentsRouter