const { validationResult } = require("express-validator");
const { responseModel } = require("../utils/responseModel");
const con = require("../const/dbConst");
const fs = require('fs');
const { insertImage, deleteImage } = require("../utils/imagegenerator");

const addFacility = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        let { name, subtitle, facility_image, status } = req.body;
        let b64img = []
        b64img = insertImage(facility_image, 'facility');
        const sql = "INSERT INTO em_facility (name, subtitle, facility_image, status, is_delete) VALUES (?, ?, ?, ?, ?)";
        con.dataBaseConnection.query(sql, [name, subtitle,  b64img[2], status, 1], function (err, _result) {
            if (err) {
                return next(err)
            }
            fs.writeFileSync('./images/facility/' + b64img[2], b64img[1], 'utf8');
            req.body['facility_image'] = b64img[2]
            res.status(200).send(responseModel(200, "Room added successfully", req.body));
        });
    } catch (err) {
        return next(err)
    }
}

const updateFacility = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        let { roomId, max_children, max_adults, max_people, min_people, title, subtitle, alias, descr, facilities, price, home, room_image } = req.body;
        const checkRoom = "SELECT * FROM em_facility WHERE id = ?";
        await con.dataBaseConnection.query(checkRoom, [roomId], function (err, result) {
            if (result.length === 0) {
                res.status(200).send(responseModel(404, "Room not found", []));
                return;
            }
            let sql = '';
            if (room_image !== '') {
                let b64img = []
                b64img = insertImage(room_image, 'facility');
                deleteImage(result[0].room_image, 'facility');
                sql = "UPDATE em_facility SET max_children = ?, max_adults = ?, max_people = ?, min_people = ?, title = ?, subtitle = ?, alias = ?,descr = ?, facilities = ?, price = ?, home = ?,room_image = ? WHERE id = ?";
                con.dataBaseConnection.query(sql, [max_children, max_adults, max_people, min_people, title, subtitle, alias, descr, facilities, price, home, b64img[2], roomId], function (_err, _result) {
                    if (err) {
                        return;
                    }
                    fs.writeFileSync('./images/facility/' + b64img[2], b64img[1], 'utf8');
                    req.body['room_image'] = b64img[2]
                    res.status(200).send(responseModel(200, "Room updated successfully", req.body));
                })
            } else {
                sql = "UPDATE em_facility SET max_children = ?, max_adults = ?, max_people = ?, min_people = ?, title = ?, subtitle = ?, alias = ?,descr = ?, facilities = ?, price = ?, home = ? WHERE id = ?";
                con.dataBaseConnection.query(sql, [max_children, max_adults, max_people, min_people, title, subtitle, alias, descr, facilities, price, home, roomId], function (_err, _result) {
                    if (err) {
                        return;
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

const deleteFacility = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        const roomID = req.query.roomId;
        const checkRoom = "SELECT * FROM em_facility WHERE id = ?";
        await con.dataBaseConnection.query(checkRoom, [roomID], function (err, result) {
            if (err) {
                return;
            }
            if (result.length === 0) {
                res.status(200).send(responseModel(404, "Room not found", []));
                return;
            }
            const sql = "UPDATE em_facility SET is_delete=1-is_delete WHERE id = ?";
            con.dataBaseConnection.query(sql, [roomID], function (_err, _result) {
                if (_err) {
                    return;
                }
                deleteImage(result[0].Image, 'facility');
                res.status(200).send(responseModel(200, "Room deleted successfully", []));
            });
        })
    } catch (err) {
        return next(err)
    }
}

module.exports = { addFacility, updateFacility, deleteFacility }