const connection = require('../../../Model/dbConnect');

const getStudentsAttendance = (req, res) => {
  const sql = `
    SELECT * FROM student_attendance
    WHERE student_id = ?
    ORDER BY date DESC
  `;

  connection.query(sql, [req.params.student_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
}

const postStudentAttendance = (req, res) => {
  const records = req.body; // array
  const staffId = Number(req.user.staff_id);
  console.log(staffId)
  console.log("USER:", req.user);

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const values = records.map((r) => [
    Number(r.student_id),
    r.date,
    r.status,
    staffId // or logged-in user
  ]);

  const sql = `
    INSERT INTO student_attendance 
    (student_id, date, status, marked_by)
    VALUES ?
    ON DUPLICATE KEY UPDATE status = VALUES(status)
  `;

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.log("MYSQL ERROR:", err);

      return res.status(500).json({
        message: err.message,
        code: err.code
      });
    }
    res.json({ message: "Attendance saved successfully" });
  });
};

const updateStudentAttendanceById = (req, res) => {
  const updateQuery = 'UPDATE student_attendance SET date = ?, status = ? WHERE student_id = ?'

  connection.query(updateQuery, [req.body.date, req.body.status, req.params.student_id], (err, result) => {
    if (err) {
      return res.status(500).json(err)
    }
    else {
      return res.json({ message: "Attendance updated successfully" })
    }
  })
}

const getAttendanceByDate = (req, res) => {

    const sql = `
        SELECT student_id, status
        FROM student_attendance
        WHERE date = ?
    `;

    connection.query(sql, [req.params.date], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

module.exports = { postStudentAttendance, getStudentsAttendance, updateStudentAttendanceById, getAttendanceByDate }