const connection = require('../../../Model/dbConnect')

const getClassSyllabusDetail = (req, res) => {
    const { dise_code } = req.params;

    const sqlquery = `SELECT 
    s.schoolName,
    s.sc_category,
    c.className,
    sub.subject_id,
    sub.subject_name,
    sy.topic,
    sy.description
FROM schools_detail s
JOIN classes c
    ON (
        (s.sc_category = 'Primary' AND c.className IN ('Class 1','Class 2','Class 3','Class 4','Class 5')) OR
        (s.sc_category = 'Middle'  AND c.className IN ('Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8')) OR
        (s.sc_category = 'HSS'     AND c.className IN ('Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'))
    )
JOIN subjects sub ON c.class_id = sub.class_id
JOIN syllabus sy ON sub.subject_id = sy.subject_id
WHERE s.dise_code = ?;`

    connection.query(sqlquery, [dise_code], (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result)
        }
    })
}


module.exports = { getClassSyllabusDetail }