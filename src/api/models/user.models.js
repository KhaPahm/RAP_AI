const mysqlModel = require("./index.models"); 
const WriteInforLog = require("../helpers/index.helpers").WriteInforLog;
module.exports = {
    async GetAllUser() {
        const strQuery = "SELECT * FROM User";
        const result = await mysqlModel.query(strQuery);
        return result;
    },
    async Login(user_name = "") {
        const strQuery = `SELECT * FROM User WHERE user_name = "${user_name}"`;
        WriteInforLog(strQuery);
        const result = await mysqlModel.query(strQuery);
        return result;
    }

}