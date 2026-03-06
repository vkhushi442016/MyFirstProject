const connection = require('../../Model/dbConnect')

let getData = (req, res) => {
    let sqlquery = 'SELECT * FROM schools_detail'

    connection.query(sqlquery, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result);
        }
    })
}

let postSchoolData = (req, res) => {
    let query = `INSERT INTO schools_detail (dise_code, schoolName, district, city, classes, staffCount, studentCount, syllabus, performance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) `
    let data = [req.body.dise_code, req.body.schoolName, req.body.district, req.body.city, req.body.classes, req.body.staffCount, req.body.studentCount, req.body.syllabus, req.body.performance]
    connection.query(query, data, (err, result) => {
        if (err) {
            console.log("Error:", err.message);
        } else {
            res.json(result);
        }
    })
}

let getSchoolNameFilter = async (req, res) => {
    const search = req.query.search || "";  //text type by user
    const column = req.query.column || "schoolName";    //column to search

    //validation
    const allowedColumns = ["schoolName"];

    if (!allowedColumns.includes(column)) {
        return res.status(400).json({ error: "Invalid column" });
    }

    const query = `SELECT * FROM schools_detail WHERE ${column} LIKE ?`;
    connection.query(query, [`%${search}%`], (err, result) => {
        if (err) {
            console.log("Error:", err.message);
        } else {
            res.json(result);
        }
    })
}

let applyPagination = (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    //Total count for total pages
    const query = 'SELECT COUNT(*) as count FROM schools_detail';
    connection.query(query, (err, result) => {
        if (err) return console.log("Error:", err.message);

        const totalItems = result[0].count;
        const totalPages = Math.ceil(totalItems / limit);

        //Fetching the paginated data
        const dataQuery = 'SELECT * FROM schools_detail ORDER BY schoolName LIMIT ? OFFSET ?';
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


module.exports = { getData, postSchoolData, getSchoolNameFilter, applyPagination }