const connection = require('../../../Model/dbConnect')

let getTotalStaffCount = (req, res) => {
    let sqlquery = 'SELECT COUNT(*) as total_staff FROM staff WHERE dise_code = ?'
    const diseCode = req.params.diseCode
    connection.query(sqlquery, [diseCode], (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result)
        }
    })
}

const getTotalStudentCount = (req, res) => {
    let sqlquery = 'SELECT COUNT(*) total_students FROM students WHERE school_id = ?'
    const diseCode = String(req.params.school_id)
    console.log("Received school_id:", diseCode);
    connection.query(sqlquery, [diseCode], (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result)
        }
    })
}

const getClassWiseStats = (req, res) => {
    const { dise_code } = req.params;

    const query = `
        SELECT
            c.class_id,
            c.className,

            COUNT(sy.topic_id) AS total_topics,

            SUM(CASE 
                    WHEN p.status = 'Completed' THEN 1 
                    ELSE 0 
                END) AS completed_topics,

            ROUND(
                (SUM(CASE 
                        WHEN p.status = 'Completed' THEN 1 
                        ELSE 0 
                    END) / COUNT(sy.topic_id)) * 100,
                2
            ) AS completion_percentage

        FROM classes c
        JOIN subjects s ON c.class_id = s.class_id
        JOIN syllabus sy ON s.subject_id = sy.subject_id

        LEFT JOIN syllabus_progress p 
            ON sy.topic_id = p.topic_id 
            AND p.dise_code = ?

        GROUP BY c.class_id, c.className
        ORDER BY c.class_id;
    `;

    connection.query(query, [dise_code], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};


module.exports = { getTotalStaffCount, getTotalStudentCount, getClassWiseStats }