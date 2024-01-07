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

        var userInfor = await userService.Login(userName, password);
        console.log(userInfor);
        if(userInfor.totalResult == 1) {
            ApiRespone.data = userInfor.userInfor;
            ApiRespone.totalResult = userInfor.totalResult;
            res.json(ApiRespone);
        } else {
            ApiRespone.resultCode = 100;
            ApiRespone.totalResult = userInfor.totalResult;
            ApiRespone.message = "Tên đăng nhập hoặc mật khẩu không đúng";
            res.json(ApiRespone);
        }
    }
}