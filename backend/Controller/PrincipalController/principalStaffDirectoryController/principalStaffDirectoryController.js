const connection = require('../../../Model/dbConnect')
const applyPaginations = require('../../Pagination/Pagination')
const paginate = applyPaginations(connection)

let getStaffData = (req, res) => {
    // let sqlquery = 'SELECT * FROM staff WHERE dise_code = ?'
    // const diseCode = req.params.diseCode
    // connection.query(sqlquery, [diseCode], (error, result) => {
    //     if (error) {
    //         console.log("Error: ", error.message);
    //     } else {
    //         return res.send(result)
    //     }
    // })

    const handler = paginate("staff", "staff_id");

    handler(req, res, "WHERE dise_code = ?", [req.params.dise_code]);
}




module.exports = { getStaffData }