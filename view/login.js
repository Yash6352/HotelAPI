const e = require("express");
const { login, getAllUsers, signUp, userStatus, deleteUser } = require("../controller/login");
const router = e.Router()
const Auth = require("../model/login");

router.post('/login', Auth('login'), login)
router.get('/getAllUsers', Auth(''), getAllUsers)
router.post('/signUp', Auth('signup'), signUp)
router.post('/userStatus', Auth('status'), userStatus)
router.post('/deleteUser', Auth('status'), deleteUser)


module.exports = router;