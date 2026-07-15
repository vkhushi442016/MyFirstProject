const express = require('express')
const studentAttendanceRouter = express.Router();
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')
const { postStudentAttendance, getStudentsAttendance, updateStudentAttendanceById, getAttendanceByDate } = require('../../Controller/TeacherController/StudentsAttendanceController/StudentsAttendanceController')



studentAttendanceRouter.post('/attendance/mark', authenticate, postStudentAttendance);
studentAttendanceRouter.get("/attendance/:student_id", getStudentsAttendance);
studentAttendanceRouter.patch("/attendance/update/:student_id", updateStudentAttendanceById);
studentAttendanceRouter.get(
   "/attendance/date/:date",
   getAttendanceByDate
);
module.exports = studentAttendanceRouter

