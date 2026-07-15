const connection = require('../../../Model/dbConnect')
const applyPaginations = require('../../Pagination/Pagination')
const redisClient = require('../../../Controller/Redis/redis')
const paginate = applyPaginations(connection)

const getStudentsData = async (req, res) => {
    // let query = 'SELECT * FROM students WHERE school_id = ?'

    // connection.query(query, [req.params.school_id], (err, result) => {
    //     if (err) {
    //         console.log("Error: ", err.message);
    //     } else {
    //         return res.send(result)
    //     }
    // })
  
    const schoolId = req.params.school_id;

    const handler = paginate("students", "student_id");

    handler(req, res, "WHERE school_id = ?", [schoolId]);
}

const postStudentData = (req, res) => {
    
    //student_name   | school_id   | class | age  | gender | guardian_name | contact
    let query = 'INSERT INTO students (student_name, school_id, class, age, ag_e, gender, email, father_name, mother_name, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
     let studentData = [req.body.student_name, req.body.school_id, req.body.class, req.body.age, req.body.ag_e, req.body.gender, req.body.email, req.body.father_name, req.body.mother_name, req.body.contact]

    connection.query(query, studentData, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const updateStudentData = (req, res) => {
   
    const filename = req.file ? req.file.filename : null;

    let sqlQuery = 'Update students SET student_name = ?, class = ?, ag_e = ?, gender = ?, father_name = ?, contact = ?, passport_img = COALESCE(?, passport_img) WHERE student_id = ?'
    let data = [req.body.student_name, req.body.class, req.body.ag_e, req.body.gender, req.body.father_name, req.body.contact, filename,
    req.params.student_id]
 console.log("studentData:", req.body)
    connection.query(sqlQuery, data, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

module.exports = { getStudentsData, updateStudentData, postStudentData }