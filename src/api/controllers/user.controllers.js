import { Login, RessetPassword, Register, VerifyOTP, ReSendOTP, UpdateUser, Logout, ExpandToken } from "../services/user.services.js";
import APIRespone from "../interfaces/api.respone.interfaces.js";
import { FolderInCloudinary, ResultCode } from "../interfaces/enum.interfaces.js";
import { UserInfor } from "../models/user.models.js";
import { UpdateAvt } from "../services/cloudinary.services.js";

export async function _LogIn(req, res) {
	const userName = req.body.userName;
	const password = req.body.password;
	const isMobile = req.body.isMobile || "false";

	const bIsMobile = (isMobile?.toLowerCase?.() === 'true');	

	const userInfor = await Login(userName, password, bIsMobile);

	if (userInfor.resultCode == ResultCode.Success) {
		res.json(APIRespone.Success(1, userInfor.data));
	} else {
		res.json(APIRespone.Err(100, userInfor.message));
	}
}

export async function _Logout(req, res) {
	const userId = req.user ? req.user.userId : 0;
	const result = await Logout(userId);
	if (result.resultCode == ResultCode.Success) {
		res.json(APIRespone.Success(0, null));
	} else {
		res.json(APIRespone.Err(100, result.message));
	}
}

export async function _ExpandToken(req, res) {
	const userId = req.user ? req.user.userId : 0;
	const dateLogin = req.user ? req.user.loginDate : 0;
	const result = await ExpandToken(userId, dateLogin);
	if (result.resultCode == ResultCode.Success) {
		res.json(APIRespone.Success(1, result.data));
	} else {
		res.status(403).json(APIRespone.Err(100, result.message));
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

export async function _ReSendOtp(req, res) {
	const userName = req.body.userName;
	const email = req.body.email;

	const result = await ReSendOTP(userName, email);

	if(result.resultCode == ResultCode.Success) {
		res.json(APIRespone.Success(1, result.data));
	} else {
		res.json(APIRespone.Err(100, result.message));
	}
}

export async function _UpdateUser(req, res) {
	const userId = req.user ? req.user.userId : 0;
	const dayOfBirth = req.body.dayOfBirth || "";
	const fullName = req.body.fullName || "";
	const phoneNumber = req.body.phoneNumber || "";
	if(userId == "" || dayOfBirth == "" || fullName == "") {
		res.json(APIRespone.Err(100, "Dữ liệu cập nhật không đủ thông tin!"));
	}
	else {
		const user = new UserInfor(userId, "", "", null, "", dayOfBirth, fullName, phoneNumber);
		const result = await UpdateUser(user);
		if(result.resultCode == ResultCode.Success) {
			res.json(APIRespone.Success(1, {dayOfBirth, fullName, phoneNumber}));
		} else {
			res.json(APIRespone.Err(100, result.message));
		}
	}
	
}

export async function _UpdateAvt(req, res) {
	const userId = req.user ? req.user.userId : 0;
    if(!req.file || userId == 0) return res.json(APIRespone.Err(100, "Dữ liệu không phù hợp"))
    const buffer = req.file.buffer;
	
	const promiseUpload = UpdateAvt(FolderInCloudinary.UserPersionalImage,  buffer, userId);
        promiseUpload
            .then((value) => {
                res.json(APIRespone.Success(1, {img: value.url}));
            })
            .catch((err) => {
                WriteErrLog(err);
				res.json(APIRespone.Err(100, "Lỗi quá trình cập nhật ảnh đại diện!"));
            });
}