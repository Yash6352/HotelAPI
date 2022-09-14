const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const { responseModel } = require("../utils/responseModel");
const con = require("../const/dbConst");
const { getCurrDate } = require("../utils/currDateTime")
const { cryptPassword, comparePassword } = require("../utils/password")

const login = async (req, res, next) => {

    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        const { email, password, type } = req.body
        const token = jwt.sign({ email }, 'ThisisTopSecret', { expiresIn: '24h' })
        const query = `select * from em_user where email=? and type=?`
        await con.dataBaseConnection.query(query, [email, type], function (err, data) {
            if (err) {
                res.status(200).send(responseModel(400, "Error occured", []));
                return;
            }
            if (data.length === 0) {
                res.status(200).send(responseModel(404, "User not found", []));
                return;
            }
            comparePassword(password, data[0]['pass'], function (err, isMatch) {
                if (!isMatch) {
                    res.status(200).send(responseModel(404, "Password does not match", []));
                    return;
                }
                res.send(responseModel(200, 'Login Successfull', user))
            })

        });

        const user = {
            email,
            token,
        }
    } catch (err) {
        return next(err)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        const checkUser = "SELECT * FROM em_user WHERE type = 'registered' and is_delete = 0";
        await con.dataBaseConnection.query(checkUser, function (err, data) {
            if (err) {
                res.status(200).send(responseModel(400, "Error occured", []));
            }
            if (data.length === 0) {
                res.status(200).send(responseModel(404, "Users not found", []));
            } else {
                data.forEach(user => {
                    delete user['pass']
                });
                res.status(200).send(responseModel(200, "getAllUsers successfully", data));
            }
        });
    } catch (err) {
        return next(err)
    }
}

const signUp = async (req, res, next) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        const { firstname, lastname, email, pass, type } = req.body;
        const insertUser = `insert em_user (firstname,lastname,email,pass,type,status,add_date,is_delete) values (?,?,?,?,?,?,?)`
        const checkuser = `select * from em_user where email = ?`
        await con.dataBaseConnection.query(checkuser, [email], function (err, data) {
            if (err) {
                res.status(200).send(responseModel(400, "Error occured", []));
            }
            if (data.length === 0) {
                let currDateTime = getCurrDate()
                cryptPassword(pass, async function (err, password) {
                    await con.dataBaseConnection.query(insertUser, [firstname, lastname, email, password, type, 1, String(currDateTime), 0], function (err, data) {
                        if (err) {
                            res.status(200).send(responseModel(400, "Error occured", []));
                            return;
                        }
                        res.status(200).send(responseModel(200, "user successfully registered", res.body));
                    })
                })
            } else {
                res.status(200).send(responseModel(400, "user is already registered", []));
            }
        })

    } catch (err) {
        console.log(err);
    }
}

const userStatus = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }

    const userId = req.query.userid;
    const checkUser = "SELECT * FROM em_user WHERE id =?";
    await con.dataBaseConnection.query(checkUser, [userId], function (err, result) {
        if (err) {
            return;
        }
        if (result.length === 0) {
            res.status(200).send(responseModel(404, "User not found", []));
            return;
        }
        const sql = "UPDATE em_user SET status = 1 - Status WHERE id = ?";
        con.dataBaseConnection.query(sql, [userId], function (_err, _result) {
            if (_err) {
                return;
            }
            res.status(200).send(responseModel(200, "User status changed successfully",));
        });
    })

}


const deleteUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }
    const checkUser = "SELECT * FROM em_user WHERE id =?";
    const userId = req.query.userid;

    await con.dataBaseConnection.query(checkUser, [userId], function (err, result) {
        if (err) {
            return;
        }
        if (result.length === 0) {
            res.status(200).send(responseModel(404, "User not found", []));
            return;
        }
        const sql = "UPDATE em_user SET is_delete=1-is_delete WHERE id = ?";
        con.dataBaseConnection.query(sql, [userId], function (_err, _result) {
            console.log(_err)
            if (_err) {
                return;
            }
            res.status(200).send(responseModel(200, "User deleted successfully",));
        });
    })
}

module.exports = { login, getAllUsers, signUp, userStatus, deleteUser }