function responseModel(status, message, data) {
    return {
        status,
        message,
        data,
    };
}
module.exports = { responseModel };