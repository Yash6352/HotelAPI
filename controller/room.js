const { validationResult } = require("express-validator");
const { responseModel } = require("../utils/responseModel");
const con = require("../const/dbConst");
const fs = require('fs');
const { insertImage, deleteImage } = require("../utils/imagegenerator");

const addRoom = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        let { max_children, max_adults, max_people, min_people, title, subtitle, alias, descr, facilities, price, home, room_image } = req.body;
        let b64img = []
        b64img = insertImage(room_image, 'room');
        const sql = "INSERT INTO em_room (max_children, max_adults, max_people, min_people, title, subtitle, alias,descr, facilities, price, home,is_delete,room_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        con.dataBaseConnection.query(sql, [max_children, max_adults, max_people, min_people, title, subtitle, alias, descr, facilities, price, home, room_image, 0, b64img[2]], function (err, _result) {
            if (err) {
                res.status(200).send(responseModel(400, "Error occured", []));
            }
            fs.writeFileSync('./images/room/' + b64img[2], b64img[1], 'utf8');
            req.body['room_image'] = b64img[2]
            res.status(200).send(responseModel(200, "Room added successfully", req.body));
        });
    } catch (err) {
        return next(err)
    }
}

const updateRoom = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        let { roomId, max_children, max_adults, max_people, min_people, title, subtitle, alias, descr, facilities, price, home, room_image } = req.body;
        const checkRoom = "SELECT * FROM em_room WHERE id = ?";
        await con.dataBaseConnection.query(checkRoom, [roomId], function (err, result) {
            if (result.length === 0) {
                res.status(200).send(responseModel(404, "Room not found", []));

            }
            let sql = '';
            if (room_image !== '') {
                let b64img = []
                b64img = insertImage(room_image, 'room');
                deleteImage(result[0].room_image, 'room');
                sql = "UPDATE em_room SET max_children = ?, max_adults = ?, max_people = ?, min_people = ?, title = ?, subtitle = ?, alias = ?,descr = ?, facilities = ?, price = ?, home = ?,room_image = ? WHERE id = ?";
                con.dataBaseConnection.query(sql, [max_children, max_adults, max_people, min_people, title, subtitle, alias, descr, facilities, price, home, b64img[2], roomId], function (_err, _result) {
                    if (err) {
                        res.status(200).send(responseModel(400, "Error occured", []));
                    }
                    fs.writeFileSync('./images/room/' + b64img[2], b64img[1], 'utf8');
                    req.body['room_image'] = b64img[2]
                    res.status(200).send(responseModel(200, "Room updated successfully", req.body));
                })
            } else {
                sql = "UPDATE em_room SET max_children = ?, max_adults = ?, max_people = ?, min_people = ?, title = ?, subtitle = ?, alias = ?,descr = ?, facilities = ?, price = ?, home = ? WHERE id = ?";
                con.dataBaseConnection.query(sql, [max_children, max_adults, max_people, min_people, title, subtitle, alias, descr, facilities, price, home, roomId], function (_err, _result) {
                    if (err) {
                        res.status(200).send(responseModel(400, "Error occured", []));

                    }
                    req.body['room_image'] = result[0]['room_image']
                    res.status(200).send(responseModel(200, "Room updated successfully", req.body));
                })
            }
        });
    } catch (err) {
        return next(err)
    }
}

const deleteRoom = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        const roomID = req.query.roomId;
        const checkRoom = "SELECT * FROM em_room WHERE id = ?";
        await con.dataBaseConnection.query(checkRoom, [roomID], function (err, result) {
            if (err) {
                res.status(200).send(responseModel(400, "Error occured", []));

            }
            if (result.length === 0) {
                res.status(200).send(responseModel(404, "Room not found", []));
                res.status(200).send(responseModel(400, "Error occured", []));

            }
            const sql = "UPDATE em_room SET is_delete=1-is_delete WHERE id = ?";
            con.dataBaseConnection.query(sql, [roomID], function (_err, _result) {
                if (_err) {
                    res.status(200).send(responseModel(400, "Error occured", []));

                }
                deleteImage(result[0].room_image, 'room');
                res.status(200).send(responseModel(200, "Room deleted successfully", []));
            });
        })
    } catch (err) {
        return next(err)
    }
}

const getAllRooms = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        console.log(res.body)
        const home = req.query.home;
        let checkRoom = "";
        if (home === "1") {
            checkRoom = "SELECT * FROM em_room WHERE is_delete = 0 and home = " + home;
        } else {
            checkRoom = "SELECT * FROM em_room WHERE is_delete = 0;"
        }
        await con.dataBaseConnection.query(checkRoom, function (err, data) {
            if (err) {
                res.status(200).send(responseModel(400, "Error occured", []));
            }
            if (data.length === 0) {
                res.status(200).send(responseModel(404, "Room not found", []));
            } else {
                res.status(200).send(responseModel(200, "getAllRooms successfully", data));
            }
        });
    } catch (err) {
        return next(err)
    }
}


module.exports = { addRoom, updateRoom, deleteRoom, getAllRooms }