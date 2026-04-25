const express = require('express')
const infraSRouter = express.Router();

const { getISData, getFacilitiesAvg } = require('../../Controller/InfrastructureFacilitiesController/InfrastructureFacilitiesController')

infraSRouter.get('/infrasdetail', getISData);
infraSRouter.get('/infras/average', getFacilitiesAvg);

module.exports = infraSRouter