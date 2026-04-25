const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, 'upload/')
    },
    filename: (req, file, cb) => {
        const d = new Date();

        cb(null, `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}` + path.extname(file.originalname));
    }
})

const upload = multer({ storage })

// const postStudentPassportPic = (upload.single('image'), (req, res) => {
//     // res.json({
//     //     message: "File uploaded successfully",
//     //     file: req.file
//     // })
//     const { student_id , student_name } = req.body;
//     const filename = req.file.filename;

//     const data = {
//         //the keys must match from database column name
//         student_id: student_id,
//         student_name: student_name,
//         image: filename
//     }

//     const query = 'UPDATE students SET passport_img = ? WHERE student_id = ? AND student_name = ?'

//     connection.query(query, data, (err, result) => {
//         if (err) return res.send(err)
//         return res.send({ Status: 200, Response: result })
//     })
// })

module.exports = upload