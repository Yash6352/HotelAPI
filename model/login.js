const { body, query } = require("express-validator");

const Auth = (method) => {
    switch (method) {
        case 'login': {
            return [
                body('email').exists().isEmail(),
                body('password').exists(),
                body('type').exists(),
            ]
        }
        case 'signup': {
            return [
                body('firstname').exists().isString(),
                body('lastname').exists().isString(),
                body('email').exists().isEmail(),
                body('pass').exists().isString(),
                body('type').exists().isString(),
            ]
        }
        case 'status': {
            return [
                query('userid').exists()
            ]
        }
        default: {
            return [

            ]
        }
    }
}
module.exports = Auth;