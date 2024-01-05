const mysqlModel = require("./models.index"); 

module.exports = {
    async GetAllUser() {
        const strQuery = "SELECT * FROM user";
        const result = await mysqlModel.query(strQuery);
        console.log(result);
        return result;
    }
}