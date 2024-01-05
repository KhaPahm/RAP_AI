const userService = require("../services/user.services");

module.exports = {
    async GetAllUser(req, res, next) {
        var t = await userService.GetAllUser();
        res.send(t.toString());
    }
}