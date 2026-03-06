const connection = require('../../Model/dbConnect')

let getTotalSchool = (req, res) => {
    let sqlquery = 'SELECT count(*) as total FROM schools_detail'

    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result)
        }
    })
}

let getTotalStaff = (req, res) => {
    let sqlquery = 'SELECT count(*) as total FROM staff'

    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result)
        }
    })
}
let getTotalStudents = (req, res) => {
    let sqlquery = 'SELECT SUM(studentCount) as total_student FROM schools_detail'

    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result)
        }
    })
}

module.exports = { getTotalSchool, getTotalStaff, getTotalStudents }