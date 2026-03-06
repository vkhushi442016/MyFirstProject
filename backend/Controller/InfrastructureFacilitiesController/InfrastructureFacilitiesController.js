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




module.exports = { getISData }