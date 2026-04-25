const express = require('express')
const pSchoolFacilitiesRoute = express.Router()
const upload = require('../../../Controller/multer');

const { getSchoolISData, getFacilities, postFacilityImages, updateSchoolFacilityData, deleteFacilityImages } = require('../../../Controller/PrincipalController/principalSchoolFacilities/principalSchoolFacilities')

pSchoolFacilitiesRoute.get('/school/facilities/:diseCode', getSchoolISData)
pSchoolFacilitiesRoute.get('/api/school/facilities-with-images/:dise_code', getFacilities)
pSchoolFacilitiesRoute.patch("/facilities/:dise_code", updateSchoolFacilityData);

pSchoolFacilitiesRoute.post("/upload-facility-image", upload.array("images", 5), postFacilityImages)
pSchoolFacilitiesRoute.delete("/facility-images", deleteFacilityImages);

module.exports = pSchoolFacilitiesRoute

