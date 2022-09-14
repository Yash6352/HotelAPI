const e = require("express");
const { addFacility } = require("../controller/facility");
const router = e.Router()
const Auth = require("../model/facility");

router.post('/addFacility', Auth('createFacility'), addFacility)

module.exports = router;