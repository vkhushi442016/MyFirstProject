const connection = require('../../Model/dbConnect')

const getStaffData = (req, res) => {
    let query = 'SELECT * FROM staff'
    connection.query(query, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const postStaffData = (req, res) =>{
    let query = 'INSERT INTO staff SET ?'
    let data = req.body;
    
    connection.query(query, data, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const updateStatus = (req, res) => {
    let query = 'UPDATE staff SET status = ? WHERE staff_id = ?';
    let data = [req.body.status, req.params.id]

    connection.query(query, data, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

let applyPaginationStaff = (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    //Total count for total pages
    const query = 'SELECT COUNT(*) as count FROM staff';
    connection.query(query, (err, result) => {
        if (err) return console.log("Error:", err.message);

        const totalItems = result[0].count;
        const totalPages = Math.ceil(totalItems / limit);

        //Fetching the paginated data
        const dataQuery = 'SELECT * FROM staff ORDER BY first_name LIMIT ? OFFSET ?';
        connection.query(dataQuery, [limit, offset], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                data: results,
                page,
                totalPages,
                totalItems
            });
        });
    });
}

module.exports = { getStaffData, postStaffData, updateStatus, applyPaginationStaff }