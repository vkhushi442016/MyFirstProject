const connection = require('../../Model/dbConnect')

const getSyllabusData = (req, res) => {
    let query = 'SELECT sd.dise_code, sd.schoolName, sd.district, st.class1, st.class2, st.class3, st.class4, st.class5, st.expected_date_of_completion FROM syllabus_track_primary_school AS st JOIN schools_detail AS sd ON st.dise_code = sd.dise_code'
    connection.query(query, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const getSyllabusDataMiddleSchool = (req, res) => {
    let query = 'SELECT sd.dise_code, sd.schoolName, st.class1, st.class2, st.class3, st.class4, st.class5, st.class6, st.class7, st.class8, st.expected_date_of_completion FROM syllabus_track_middle_school AS st JOIN schools_detail AS sd ON st.dise_code = sd.dise_code'
    connection.query(query, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const getSyllabusDataHigherSchool = (req, res) => {
    let query = 'SELECT sd.dise_code, sd.schoolName, st.class1, st.class2, st.class3, st.class4, st.class5, st.class6, st.class7, st.class8,  st.class9,  st.class10,  st.class11,  st.class12, st.expected_date_of_completion FROM syllabus_track_higher_school AS st JOIN schools_detail AS sd ON st.dise_code = sd.dise_code'
    connection.query(query, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const getSubjectWiseSyllabus = (req, res) => {
    const sql = 'SELECT topic, description FROM syllabus WHERE LOWER(subject_id) = LOWER(?)';
    const subjectId = req.params.subject_id;

    connection.query(sql, [subjectId], (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const postSubjectWiseSyllabus = (req, res) => {
    const sql = 'INSERT INTO syllabus (subject_id, topic, description ) VALUES (?, ?, ?)';
    const { subject_id, topic, description } = req.body;

    connection.query(sql, [subject_id, topic, description], (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })
}

const getClasses = (req, res) => {
    const sql = 'SELECT c.class_id, c.className FROM classes as c ORDER BY CAST(SUBSTRING(class_id, 6) AS UNSIGNED);';
    connection.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    })
}

const getSubjects = (req, res) => {
    const classId = req.params.class_id;
    const sql = `
    SELECT subject_id, subject_name
    FROM subjects
    WHERE class_id = ?
    `;

    connection.query(sql, [classId], (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
}

const postNewSubject = (req, res) => {
    const classId = req.params.class_id;
    const { subject_id, subject_name } = req.body;

    const sql = `
    INSERT INTO subjects (class_id, subject_id, subject_name)
    VALUES (?, ?, ?)
    `;

    connection.query(sql, [classId, subject_id, subject_name], (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
}

const deleteTopic = (req, res) => {
    const { subject_id, topic} = req.params;
    let sql = `DELETE FROM syllabus WHERE subject_id = ? AND topic = ?`;

    connection.query(sql, [subject_id, topic], (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            return res.send(result)
        }
    })

}

module.exports = { getSyllabusData, getSyllabusDataMiddleSchool, getSyllabusDataHigherSchool, getSubjectWiseSyllabus, getClasses, getSubjects, postSubjectWiseSyllabus, postNewSubject, deleteTopic }