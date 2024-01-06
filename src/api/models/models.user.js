const mysqlModel = require("./models.index"); 

module.exports = {
    async GetAllUser() {
        const strQuery = "SELECT * FROM User";
        const result = await mysqlModel.query(strQuery);
        console.log(result);
        return result;
    }
}