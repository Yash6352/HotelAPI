const { body, query } = require("express-validator");

const Auth = (method) => {
    switch (method) {
        case 'createRoom': {
            return [
                body('max_children').exists().isInt(),
                body('max_adults').exists().isInt(),
                body('max_people').exists().isInt(),
                body('min_people').exists().isInt(),
                body('title').exists().isString(),
                body('subtitle').exists().isString(),
                body('alias').exists().isString(),
                body('descr').exists().isString(),
                body('facilities').exists().isString(),
                body('price').exists().isFloat(),
                body('home').exists().isInt(),
                body('room_image').exists().isString(),
            ]
        }
        case 'updateRoom': {
            return [
                body('roomId').exists().isInt(),
                body('max_children').exists().isInt(),
                body('max_adults').exists().isInt(),
                body('max_people').exists().isInt(),
                body('min_people').exists().isInt(),
                body('title').exists().isString(),
                body('subtitle').exists().isString(),
                body('alias').exists().isString(),
                body('descr').exists().isString(),
                body('facilities').exists().isString(),
                body('price').exists().isFloat(),
                body('home').exists().isInt(),
                body('room_image').exists().isString(),
            ]
        }
        case 'deleteRoom': {
            return [
                query('roomId').exists()
            ]
        }
        default: {
            return [
                
            ]
        }
    }
}
module.exports = Auth;