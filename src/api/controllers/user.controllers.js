const userService = require("../services/user.services");
const StrHelpers = require("../helpers/string.helpers");
var ApiRespone = require("../interfaces/api.respone.interfaces");
const upload = require('multer')();


module.exports = {
    async GetAllUser(req, res, next) {
        var t = await userService.GetAllUser();
        res.send(t.toString());
    },
    async LogIn(req, res, next) {
        const userName = req.body.userName;
        const password = req.body.password;

        const userInfor = await userService.Login(userName, password);
        if(userInfor.totalResult == 1) {
            const apiRespone = new ApiRespone(userInfor.totalResult, userInfor.userInfor);
            res.json(apiRespone);
        } else {
            const apiRespone = new ApiRespone(userInfor.totalResult, userInfor.userInfor, 100, "Tên đăng nhập hoặc mật khẩu không đúng");
            res.json(apiRespone);
        }
    }
}