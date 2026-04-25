const connection = require('../../../Model/dbConnect')

const getSyllabusUpdate = (req, res) => {
    let query = `SELECT
    c.className,
    s.subject_name,
    sy.topic_id,
    sy.topic,
    COALESCE(p.status, 'Not Started') AS status
FROM syllabus sy
JOIN subjects s ON sy.subject_id = s.subject_id
JOIN classes c ON s.class_id = c.class_id
LEFT JOIN syllabus_progress p 
    ON sy.topic_id = p.topic_id 
    AND p.dise_code = ?
WHERE c.class_id = ?;
     `

    connection.query(query, [req.params.dise_code, req.params.class_id], (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const postSyllabusUpdate = (req, res) => {
    const { topic_id, status, dise_code } = req.body;

    const query = `
    INSERT INTO syllabus_progress (topic_id, status, dise_code)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE status = ?
  `;

    connection.query(query, [topic_id, status, dise_code, status], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Updated" });
    });
};


const getSubjectStatus = (req, res) => {
    const { dise_code, class_id } = req.params;

    const query = `
        SELECT
            s.subject_id,
            s.subject_name,

            COUNT(sy.topic_id) AS total_topics,

            SUM(CASE 
                    WHEN p.status = 'Completed' THEN 1 
                    ELSE 0 
                END) AS completed_topics,

            SUM(CASE 
                    WHEN p.status = 'In Progress' THEN 1 
                    ELSE 0 
                END) AS in_progress_topics,

            SUM(CASE 
                    WHEN p.status IS NULL 
                         OR p.status = 'Not Started' THEN 1 
                    ELSE 0 
                END) AS not_started_topics,

            ROUND(
                (SUM(CASE 
                        WHEN p.status = 'Completed' THEN 1 
                        ELSE 0 
                    END) / COUNT(sy.topic_id)) * 100,
                2
            ) AS completion_percentage

        FROM subjects s
        JOIN syllabus sy ON s.subject_id = sy.subject_id

        LEFT JOIN syllabus_progress p 
            ON sy.topic_id = p.topic_id 
            AND p.dise_code = ?

        WHERE s.class_id = ?

        GROUP BY s.subject_id, s.subject_name;
    `;

    connection.query(query, [dise_code, class_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(result);
    });
};

const classesForDropdown = (req, res) => {
    const query = `SELECT class_id, className
        FROM classes
        ORDER BY CAST(SUBSTRING(class_id, 6) AS UNSIGNED);`
    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(result);
    })
}

module.exports = { getSyllabusUpdate, postSyllabusUpdate, getSubjectStatus, classesForDropdown }