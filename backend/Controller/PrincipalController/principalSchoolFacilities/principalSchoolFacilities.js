const connection = require('../../../Model/dbConnect')

let getSchoolISData = (req, res) => {
    const sqlquery = `SELECT * FROM facilities WHERE dise_code = ?`
    const diseCode = req.params.diseCode;
    connection.query(sqlquery, [diseCode], (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            return res.send(result);
        }
    })
}

const getFacilities = (req, res) => {
    const { dise_code } = req.params;

    const query = `
        SELECT 
            f.*,
            fi.facility_type,
            fi.image_path
        FROM facilities f
        LEFT JOIN facility_images fi 
            ON f.dise_code = fi.dise_code
        WHERE f.dise_code = ?;
    `;

    connection.query(query, [dise_code], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.json({ facilities: {} });
        }

        const row = result[0];

        // Step 1: Initialize all facilities
        const facilities = {
            drinking_water: { available: row.drinking_water === 1, images: [] },
            kitchen: { available: row.kitchen === 1, images: [] },
            play_ground: { available: row.play_ground === 1, images: [] },
            toilet: { available: row.toilet === 1, images: [] },
            hm_room: { available: row.hm_room === 1, images: [] },
            separate_classrooms: { available: row.separate_classrooms === 1, images: [] },
            electricity: { available: row.electricity === 1, images: [] }
        };

        // Step 2: Attach images
        result.forEach(r => {
            if (r.facility_type && r.image_path) {
                facilities[r.facility_type]?.images.push(r.image_path);
            }
        });

        res.json({
            dise_code: row.dise_code,
            condition: row.condition,
            facilities
        });
    });
};

// const updateStudentData = (req, res) => {
//     console.log("studentData:", data)
//     const filename = req.file ? req.file.filename : null;

//     let sqlQuery = 'Update students SET student_name = ?, class = ?, age = ?, gender = ?, guardian_name = ?, contact = ?, passport_img = COALESCE(?, passport_img) WHERE student_id = ?'
//     let data = [req.body.student_name, req.body.class, req.body.age, req.body.gender, req.body.guardian_name, req.body.contact, filename,
//     req.params.student_id]

//     connection.query(sqlQuery, data, (err, result) => {
//         if (err) {
//             console.log("Error: ", err.message);
//         } else {
//             return res.send(result)
//         }
//     })
// }

const postFacilityImages = (req, res) => {
    const { dise_code, facility_type } = req.body;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    const values = req.files.map(file => [
        dise_code,
        facility_type,
        file.filename   // stored filename
    ]);

    const query = `
        INSERT INTO facility_images (dise_code, facility_type, image_path)
        VALUES ?
    `;

    connection.query(query, [values], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Images uploaded successfully" });
    });
};

// const updateSchoolFacilityData = (req, res) => {

//     const data = [
//         req.body.drinking_water,
//         req.body.kitchen,
//         req.body.play_ground,
//         req.body.toilet,
//         req.body.hm_room,
//         req.body.separate_classrooms,
//         req.body.electricity,
//         req.params.dise_code
//     ];

//     console.log(data)

//         const sqlQuery = `
//         UPDATE facilities
//         SET 
//             drinking_water = ?,
//             kitchen = ?,
//             play_ground = ?,
//             toilet = ?,
//             hm_room = ?,
//             separate_classrooms = ?,
//             electricity = ?
//         WHERE dise_code = ?;
//     `;
//     // Run the update once
//     connection.query(sqlQuery, data, (err, result) => {
//         if (err) {
//             console.error("Update Error:", err);
//             return res.status(500).send({ message: err.sqlMessage });
//         }

//         console.log("affectedRows:", result.affectedRows);
//     });
// };

const updateSchoolFacilityData = (req, res) => {
    const { dise_code } = req.params;
    const updates = req.body;

    const allowedFields = [
        "drinking_water",
        "kitchen",
        "play_ground",
        "toilet",
        "hm_room",
        "separate_classrooms",
        "electricity"
    ];

    let fields = [];
    let values = [];

    Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        }
    });

    if (fields.length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
    }

    const query = `
        UPDATE facilities
        SET ${fields.join(", ")}
        WHERE dise_code = ?
    `;

    values.push(dise_code);

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error("Update Error:", err);
            return res.status(500).json({ message: err.sqlMessage });
        }

        res.json({
            message: "Updated successfully",
            affectedRows: result.affectedRows
        });
    });
};

const deleteFacilityImages = (req, res) => {
    const { dise_code, facility_type } = req.body;

    const query = `
        DELETE FROM facility_images
        WHERE dise_code = ? AND facility_type = ?
    `;

    connection.query(query, [dise_code, facility_type], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Images deleted" });
    });
};


module.exports = { getSchoolISData, getFacilities, postFacilityImages, updateSchoolFacilityData, deleteFacilityImages }

