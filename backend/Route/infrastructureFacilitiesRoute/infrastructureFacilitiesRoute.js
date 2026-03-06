const express = require('express')
const infraSRouter = express.Router();

const { getISData } = require('../../Controller/InfrastructureFacilitiesController/InfrastructureFacilitiesController')

infraSRouter.get('/infrasdetail', getISData);

module.exports = infraSRouter