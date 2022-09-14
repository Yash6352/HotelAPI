const e = require('express');
const Auth = require('../model/room');
const router = e.Router()
const { addRoom, updateRoom, deleteRoom, getAllRooms } = require('../controller/room')

router.post('/addRoom', Auth('createRoom'), addRoom)
router.patch('/updateRoom', Auth('updateRoom'), updateRoom)
router.delete('/deleteRoom', Auth('deleteRoom'), deleteRoom)
router.get('/getAllRoom', Auth(''), getAllRooms)

module.exports = router;