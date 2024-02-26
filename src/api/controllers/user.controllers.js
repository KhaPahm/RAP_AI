import { Login, RessetPassword, Register, VerifyOTP } from "../services/user.services.js";
import APIRespone from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";

export async function _LogIn(req, res) {
	const userName = req.body.userName;
	const password = req.body.password;

	const userInfor = await Login(userName, password);

	if (userInfor.resultCode == ResultCode.Success) {
		res.json(APIRespone.Success(1, userInfor.data));
	} else {
		res.json(APIRespone.Err(100, userInfor.message));
	}
}

export async function _SetPassword(req, res) {
	const userId = req.user.userId; //Đổi lại
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	const result = await RessetPassword(userId, oldPassword, newPassword);
	if(result.resultCode != ResultCode.Err) {
		res.json(APIRespone.Success(0, null));
	} else {
		res.json(APIRespone.Err(100, result.message));
	}
}

export async function _Register(req, res) {
	const userName = req.body.userName;
	const password = req.body.password;
	const email = req.body.email;
	const dayOfBirth = req.body.dayOfBirth;
	const fullName = req.body.fullName;
	const phoneNumber = req.body.phoneNumber;

	const result = await Register(userName, password, email, dayOfBirth, fullName, phoneNumber);
	if(result.resultCode == ResultCode.Success) {
		res.json(APIRespone.Success(1, result.data));
	} else {
		res.json(APIRespone.Err(100, result.message));
	}
}

export async function _VerifyOtp(req, res) {
	const userName = req.body.userName;
	const email = req.body.email;
	const otp = req.body.otp;

	const result = await VerifyOTP(userName, email, otp);

	if(result.resultCode == ResultCode.Success) {
		res.json(APIRespone.Success(0, null));
	} else {
		res.json(APIRespone.Err(100, result.message));
	}
}