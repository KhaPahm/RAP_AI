import { Login, RessetPassword } from "../services/user.services.js";
import APIRespone from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";

export async function LogIn(req, res) {
	const userName = req.body.userName;
	const password = req.body.password;

	const userInfor = await Login(userName, password);

	if (userInfor != null) {
		res.json(APIRespone.Success(1, userInfor));
	} else {
		res.json(APIRespone.Err(100, "Tên đăng nhập hoặc mật khẩu không đúng"));
	}
}

export async function SetPassword(req, res) {
	const userId = 1000; //Đổi lại
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	const result = await RessetPassword(userId, oldPassword, newPassword);
	if(result.resultCode != ResultCode.Err) {
		res.json(APIRespone.Success(1, null));
	} else {
		res.json(APIRespone.Err(100, result.message));
	}

}