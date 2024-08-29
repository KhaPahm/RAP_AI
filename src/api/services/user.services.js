
import { WriteErrLog } from "../helpers/index.helpers.js";
import { ConverDateTimeToString } from "../helpers/string.helpers.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { FolderInCloudinary, ImageType, ResultCode } from "../interfaces/enum.interfaces.js";
import ImageModel from "../models/image.models.js";
import { UserInfor } from "../models/user.models.js";
import { SendingMail } from "./mail.services.js";
import { UpdateAvt, UploadImage } from "./cloudinary.services.js";
import { Status } from "../interfaces/enum.interfaces.js";
import passport from "passport";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function Login(userName = "", password = "", isMobile = false) {
	const _userInfor = await UserInfor.Login(userName, password, isMobile);
	return _userInfor;
}

export async function Logout(userId) {
	const _userInfor = await UserInfor.Logout(userId);
	return _userInfor;
}

export async function ExpandToken(userId, dateLogin) {
	const result = await UserInfor.ExpandToken(userId, dateLogin)
	return result
}

export async function RessetPassword(userName, oldPassword, newPassword) {
	const _resultReset = await UserInfor.ResetPassword(userName, oldPassword, newPassword);
	return _resultReset;
}

export async function ReSendOTP(userName = "", email = "") {
	const _resultResend = await UserInfor.ReSendOPT(userName, email);
	if(_resultResend.resultCode == ResultCode.Success) 
	{
		//Gửi mail xác thực
		var template = await fs.readFileSync(__dirname + "/../../static/static_mail_format_OTP.html", "utf8");
        template = template.replace("[0000]", _resultResend.data);

		const resultEmailSending = await SendingMail(email, "Verify account", template);
		//Nếu gửi mail thành công
		if(resultEmailSending == ResultCode.Success) {
			//Nếu gủi mail khoogn thành công thì xóa mã OTP trong db
			const reusultClearOTP = await UserInfor.ClearOTP(userName);
			if(reusultClearOTP != ResultCode.Success)
				WriteErrLog(reusultClearOTP.message);
		}
		resultEmailSending.data = {
			email,
			userName
		}

		return resultEmailSending; //Trả về kết quá gửi mail
	}

	return _resultResend;

}

export async function Register(userName = "", password = "", email = "", dayOfBirth = "", fullName = "", phoneNumber = "") {
	const resultRegister = await UserInfor.Register(userName, password, email, dayOfBirth, fullName, phoneNumber);
	//Nếu ghi dữ liệu vào db thành công thì gửi mail xác thực
	if(resultRegister.resultCode == ResultCode.Success) 
	{
		//Gửi mail xác thực
		//resultRegister.data.otp
		var template = await fs.readFileSync(__dirname + "/../../static/static_mail_format_OTP.html", "utf8");
        template = template.replace("[0000]", resultRegister.data.otp);

		const resultEmailSending = await SendingMail(email, "Verify account", template);
		//Nếu gửi mail thành công
		if(resultEmailSending.resultCode != ResultCode.Success) {
			//Nếu gủi mail khoogn thành công thì xóa mã OTP trong db
			const reusultClearOTP = await UserInfor.ClearOTP(userName);
			if(reusultClearOTP != ResultCode.Success)
				WriteErrLog(reusultClearOTP.message);
		}
		resultEmailSending.data = {
			email,
			userName
		}
		return resultEmailSending; //Trả về kết quá gửi mail
	}

	//Nếu có lỗi quá trình thêm vào db thì trả lỗi thẳng ra ngoài
	return resultRegister;
}

export async function VerifyOTP(user_name = "", email = "", otp = 0) {
	const resultVerify = await UserInfor.VerifyOTP(user_name, email, otp);
	if(resultVerify.resultCode == ResultCode.Err) {
		WriteErrLog(resultVerify.message);
	}
	return resultVerify;
}

export async function UpdateUser(user = new UserInfor()) {
	const result =  await user.Update();
	return result;
}

export async function GetUsersList(status = "") {
	return await UserInfor.GetUsersList(status);
}

export async function UpdateUserStatus(userId = 0, status = Status.OK) {
	return await UserInfor.UpdateUserStatus(userId, status);
}

export async function CreateOfficerAccount(userName = "", email = "", dayOfBirth = "", fullName = "", phoneNumber = "") {
	const resultRegister = await UserInfor.CreateOfficerAccount(userName, email, dayOfBirth, fullName, phoneNumber);
	//Nếu ghi dữ liệu vào db thành công thì gửi mail xác thực
	if(resultRegister.resultCode == ResultCode.Success) 
	{
		//Gửi mail xác thực
		var template = await fs.readFileSync(__dirname + "/../../static/static_mail_format_NewAccount.html", "utf8");
        template = template.replace("[username]", resultRegister.data.userName);
        template = template.replace("[password]", resultRegister.data.password);
        template = template.replace("[fullName]", fullName);

		const resultEmailSending = await SendingMail(email, "Account information", template);
		//Nếu gửi mail thành công
		if(resultEmailSending.resultCode != ResultCode.Success) {
			//Nếu gủi mail khoogn thành công thì xóa mã OTP trong db
			const reusultClearOTP = await UserInfor.ClearOTP(userName);
			if(reusultClearOTP != ResultCode.Success)
				WriteErrLog(reusultClearOTP.message);
		}
		resultEmailSending.data = {
			email,
			userName
		}
		return resultEmailSending; //Trả về kết quá gửi mail
	}

	//Nếu có lỗi quá trình thêm vào db thì trả lỗi thẳng ra ngoài
	return resultRegister;
}


export async function CheckUserForgotPasswordord(userName = "") {
	const resultCheck = await UserInfor.CheckUserForgotPassword(userName);
	if(resultCheck.resultCode != ResultCode.Success) {
		return resultCheck;
	}

	//Gửi mail xác thực
	const resultEmailSending = await SendingMail(resultCheck.data.email, "Reset Password", `Your OTP is: ${resultCheck.data.otp}`);

	//Nếu gửi mail thành công
	if(resultEmailSending.resultCode != ResultCode.Success) {
		//Nếu gủi mail khoogn thành công thì xóa mã OTP trong db
		const reusultClearOTP = await UserInfor.ClearOTP(userName);
		if(reusultClearOTP != ResultCode.Success)
			WriteErrLog(reusultClearOTP.message);

		return resultEmailSending;
	}
	
	return resultCheck;
}