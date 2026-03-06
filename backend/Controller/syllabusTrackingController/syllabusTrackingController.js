const connection = require('../../Model/dbConnect')

const getSyllabusData = (req, res) => {
    let query = 'SELECT sd.dise_code, sd.schoolName, st.class1, st.class2, st.class3, st.class4, st.class5, st.expected_date_of_completion FROM syllabus_track_primary_school AS st JOIN schools_detail AS sd ON st.dise_code = sd.dise_code'
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

module.exports = { getSyllabusData, getSyllabusDataMiddleSchool, getSyllabusDataHigherSchool }