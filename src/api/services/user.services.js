
import { WriteErrLog } from "../helpers/index.helpers.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";
import { UserInfor } from "../models/user.models.js";
import { SendingMail } from "./mail.services.js";

export async function Login(userName = "", password = "") {
	const _userInfor = await UserInfor.Login(userName, password);
	return _userInfor;
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
		const resultEmailSending = await SendingMail(email, "Verify account", `Your OTP is: ${_resultResend.data}`, userName);
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
		const resultEmailSending = await SendingMail(email, "Verify account", `Your OTP is: ${resultRegister.data.otp}`, userName);
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