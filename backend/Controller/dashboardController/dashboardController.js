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

let getUserProfile = (req, res) => {
    let sqlquery = 'SELECT * FROM staff WHERE staff_id = ?'
    let staffId = req.params.id;
    connection.query(sqlquery, [staffId], (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.json(result[0]);
        }
    })
}

let getSyllabusDataFromSchoolDetails = (req, res) => {
    let sqlquery = `SELECT 
                        district, 
                        AVG(syllabus) AS avg_syllabus
                    FROM schools_detail
                    GROUP BY district`
    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.json(result);
        }
    })
}

const getPast30DaysSchoolCount = (req, res) => {
    let sqlquery = `SELECT COUNT(*) AS last_30_days
            FROM schools_detail
            WHERE created_at >= CURDATE() - INTERVAL 30 DAY;`

    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.json(result);
        }
    })
}

let getPast30DaysStaffCount = (req, res) => {
    let sqlquery = `SELECT COUNT(*) AS last_30_days
            FROM staff
            WHERE created_at >= CURDATE() - INTERVAL 30 DAY;`
    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.json(result);
        }
    })
}

module.exports = { getTotalSchool, getTotalStaff, getTotalStudents, getUserProfile, getSyllabusDataFromSchoolDetails, getPast30DaysSchoolCount, getPast30DaysStaffCount }