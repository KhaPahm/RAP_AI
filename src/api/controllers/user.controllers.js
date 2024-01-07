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
        const respone = Object.create(ApiRespone);
        if(userInfor.totalResult == 1) {
            respone.data = userInfor.userInfor;
            respone.totalResult = userInfor.totalResult;
            res.json(respone);
        } else {
            respone.resultCode = 100;
            respone.totalResult = userInfor.totalResult;
            respone.message = "Tên đăng nhập hoặc mật khẩu không đúng";
            res.json(respone);
        }
    }
}