const mime = require("mime");
const { baseURL } = require("../const/baseUrl");
const fs = require('fs');

function generateRandomName(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function insertImage(imgb64, imgpath) {
    let matches = imgb64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

    let response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.getExtension(type);
    let fileName = generateRandomName(2) + '.' + extension;
    return [baseURL + `/images/${imgpath}/` + fileName, imageBuffer, fileName];
}
function deleteImage(imgname, imgpath) {
    fs.unlink('./images/' + imgpath + '/' + imgname, (_err) => {
        return true;
    }
    )
}

module.exports = { insertImage, deleteImage };