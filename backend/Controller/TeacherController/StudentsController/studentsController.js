const connection = require('../../../Model/dbConnect')
const applyPaginations = require('../../Pagination/Pagination')
const paginate = applyPaginations(connection)

const getStudentsData = (req, res) => {
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
    let query = 'INSERT INTO students (student_name, school_id, class, age, gender, father_name, contact) VALUES (?, ?, ?, ?, ?, ?, ?)';
     let studentData = [req.body.student_name, req.body.school_id, req.body.class, req.body.age, req.body.gender, req.body.father_name, req.body.contact]

    connection.query(query, studentData, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const updateStudentData = (req, res) => {
    console.log("studentData:", data)
    const filename = req.file ? req.file.filename : null;

    let sqlQuery = 'Update students SET student_name = ?, class = ?, age = ?, gender = ?, father_name = ?, contact = ?, passport_img = COALESCE(?, passport_img) WHERE student_id = ?'
    let data = [req.body.student_name, req.body.class, req.body.age, req.body.gender, req.body.father_name, req.body.contact, filename,
    req.params.student_id]

    connection.query(sqlQuery, data, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

module.exports = { getStudentsData, updateStudentData, postStudentData }