const connection = require('../../Model/dbConnect')

let getISData = (req, res) => {
    let sqlquery = 'SELECT f.*, s.schoolName FROM facilities AS f JOIN schools_detail AS s ON s.dise_code = f.dise_code'

    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result);
        }
    })
}

const getFacilitiesAvg = (req, res) => {
    let sqlquery = 'SELECT ROUND(AVG(drinking_water)*100, 1) drinking_water_avg, ROUND(AVG(kitchen)*100, 1) kitchen_avg, ROUND(AVG(separate_classrooms)*100, 1) separate_classroom_avg, ROUND(AVG(electricity)*100, 1) electricity_avg from facilities'

    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result);
        }
    })
}




module.exports = { getISData, getFacilitiesAvg }