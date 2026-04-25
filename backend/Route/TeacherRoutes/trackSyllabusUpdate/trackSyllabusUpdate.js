const express = require('express')
const syUpdateRouter = express.Router();


const { getSyllabusUpdate, postSyllabusUpdate, getSubjectStatus, classesForDropdown } = require("../../../Controller/TeacherController/trackSyllabusUpdate/trackSyllabusUpdate")

syUpdateRouter.get("/api/syllabus/:class_id/:dise_code", getSyllabusUpdate);
syUpdateRouter.post("/api/update-status", postSyllabusUpdate);
syUpdateRouter.get("/subject-stats/:class_id/:dise_code", getSubjectStatus);
syUpdateRouter.get("/api/dropdown-class", classesForDropdown);

module.exports = syUpdateRouter