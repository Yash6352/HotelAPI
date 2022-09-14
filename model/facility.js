const { body, query } = require("express-validator");

const Auth = (method) => {
    switch (method) {
        case 'createFacility': {
            return [
                body('name').exists().isString(),
                body('subtitle').exists().isString(),
                body('facility_image').exists().isString(),
                body('status').exists().isInt(),
            ]
        }
        case 'updateFacility': {
            return [
                body('facilityid').exists().isInt(),
                body('name').exists().isString(),
                body('subtitle').exists().isString(),
                body('facility_image').exists().isString(),
                body('status').exists().isInt(),
            ]
        }
        case 'deleteFacility': {
            return [
                query('facilityid').exists()
            ]
        }
    }
}
module.exports = Auth;