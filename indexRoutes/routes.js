const express = require("express");
const router = express.Router()


router.use("/Auth", require("../view/login"));
router.use("/Room", require("../view/room"));
router.use("/Facility", require("../view/facility"));


module.exports = router;