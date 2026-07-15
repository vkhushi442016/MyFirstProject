const express = require('express')
const staffRouter = express.Router();

const { getStaffData, getRoles, postStaffData, updateStatus, applyPaginationStaff, updateStaffData, updateStaffImg } = require('../../Controller/staffDirectoryController/staffDirectoryController')
const { authenticate } = require('../../Controller/authMiddleware/authMiddleware')
const upload = require("../../Controller/multer")

staffRouter.get('/staffdetail', getStaffData);
staffRouter.post('/staffdetail', postStaffData)
staffRouter.patch('/staffdetail/:id', updateStatus)
staffRouter.get('/schoolpagination', applyPaginationStaff);
staffRouter.get('/roles', getRoles)
staffRouter.patch('/update/staff/:staff_id', updateStaffData)
staffRouter.patch('/update-profile', upload.single("image"), updateStaffImg)

module.exports = staffRouter