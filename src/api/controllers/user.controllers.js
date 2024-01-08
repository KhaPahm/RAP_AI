import { GetAllUser as _GetAllUser, Login } from "../services/user.services.js";
import APIRespone from "../interfaces/api.respone.interfaces.js";
export async function GetAllUser(req, res) 
{
	var t = await _GetAllUser();
	res.send(t.toString());
}
export async function LogIn(req, res) {
	const userName = req.body.userName;
	const password = req.body.password;

	const userInfor = await Login(userName, password);

	if (userInfor != 1) {
		res.json(APIRespone.Success(1, userInfor));
	} else {
		res.json(APIRespone.Err(100, "Tên đăng nhập hoặc mật khẩu không đúng"));
	}
}