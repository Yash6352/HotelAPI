const mysql = require("mysql");
const con = require('../const/dbConst');

module.exports = () => {
    con.dataBaseConnection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "hotel"
    });
    con.dataBaseConnection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });
}