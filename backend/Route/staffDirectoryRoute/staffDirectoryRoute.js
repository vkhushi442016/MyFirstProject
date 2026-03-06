const express = require('express')
const staffRouter = express.Router();
const { getStaffData, postStaffData, updateStatus, applyPaginationStaff } = require('../../Controller/staffDirectoryController/staffDirectoryController')

staffRouter.get('/staffdetail', getStaffData);
staffRouter.post('/staffdetail', postStaffData)
staffRouter.patch('/staffdetail/:id', updateStatus)
staffRouter.get('/schoolpagination', applyPaginationStaff);

module.exports = staffRouter