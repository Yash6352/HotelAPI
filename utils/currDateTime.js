const getCurrDate = () => {
    let currentdate = new Date();
    return currentdate.getDay() + "/" + currentdate.getMonth()
        + "/" + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":" + currentdate.getSeconds();
}
module.exports = { getCurrDate }