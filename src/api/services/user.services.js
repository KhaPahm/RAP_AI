
import { UserInfor } from "../models/user.models.js";

export async function Login(userName = "", password = "") {
	const _userInfor = await UserInfor.Login(userName, password);
	return _userInfor;
}

export async function RessetPassword(userId, oldPassword, newPassword) {
	const _resultReset = await UserInfor.ResetPassword(userId, oldPassword, newPassword);
	return _resultReset;
}