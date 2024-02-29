import { query } from "./index.models.js"; 
import { compare } from "bcrypt"; 
import { Menu } from "./menu.models.js";
import { WriteErrLog } from "../helpers/index.helpers.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode, Status } from "../interfaces/enum.interfaces.js";
import ImageModel from "./image.models.js";
import { Role } from "./role.models.js";

export class UserInfor {
	constructor(user_id = "", user_name = "", accessToken = "", role = null, email = "", day_of_birth = null, full_name = "", phone_number = "", avt = "", status = Status.OK) {
		this.userId = user_id;
		this.userName = user_name;
		this.accessToken = accessToken;
		this.role = role;
		this.email = email;
		this.dayOfBirth = day_of_birth;
		this.fullName = full_name;
		this.phoneNumber = phone_number;
		this.avt = avt;
		this.status = status;
	}

	set SetToken(accessToken) {
		this.accessToken = accessToken;
	}

	set SetRole(role = {}) {
		this.role = role;
	}

	static async GenToken (payload, accessToken = true) {
		const options = {
			expiresIn: accessToken ? "10m" : "14d"
		};
	
		const secrectSign = accessToken ? 
		// eslint-disable-next-line no-undef
			process.env.JWT_SIGN_ACCESS_KEY : process.env.JWT_SIGN_REFRESH_KEY;
	
		try {
			const access_token = await jwt.sign(payload, secrectSign, options);
	
			return access_token;
		} catch(err) {
			WriteErrLog("Lỗi tạo accessToken: \n" + err);
			return null;
		}
	}

	static async HashPassword(password) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	}

	static async Login(user_name = "", password = "") {
		const strQuery = `SELECT * FROM User WHERE user_name = "${user_name}" AND status = "OK"`;
		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success && result.data.length == 1) {
			//So sánh password
			const match = await compare(password, result.data[0].password);
			//Nếu như mật khẩu match
			if(match) {
				//Tạo access token
				const role = await Menu.GetListMenuPath(result.data[0].user_id);
				const accessToken = await UserInfor.GenToken({
					userId: result.data[0].user_id, 
					userName: result.data[0].user_name, 
					role: role
				});
				const avt = await ImageModel.GetImage(result.data[0].avt);
				
				//Trả về thông tin user
				return new Result(ResultCode.Success, "Success", new UserInfor(
					result.data[0].user_id, 
					result.data[0].user_name, 
					accessToken,
					role.data,
					result.data[0].email, 
					result.data[0].day_of_birth, 
					result.data[0].full_name, 
					result.data[0].phone_number,
					avt.data == null ? null : avt.data[0].image_public_path
				));
			}
		}
		else if(result.resultCode == ResultCode.Success && result.data.length == 0) {
			return new Result(ResultCode.Warning, "Tài khoản hoặc mật khẩu không đúng!", null);
		}

		return new Result(ResultCode.Err, "Lỗi quá trình đăng nhập!", null);
	}

	static async ResetPassword(userId = 0, oldPassword = "", newPassword = "") {
		const strQuery = `SELECT * FROM User WHERE user_id = "${userId}" AND status = "OK"`;
		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success && result.data.length != 0) {
			//So sánh password
			const match = await compare(oldPassword, result.data[0].password);
			//Nếu như mật khẩu match
			if(match) {
				const hashedNewPassword = await this.HashPassword(newPassword);
				const strQueryUpdatePassword = `UPDATE User SET password = "${hashedNewPassword}" WHERE user_id = ${userId}`;
				const resultUpdate = await query(strQueryUpdatePassword);
				if(resultUpdate.resultCode != ResultCode.Success) {
					return new Result(ResultCode.Err, "Lỗi trong quá trình cập nhật! Vui lòng thử lại!")
				}
				return new Result(ResultCode.Success, "Đổi mật khẩu thành công!")
			}
			return new Result(ResultCode.Err, "Mật khẩu cũ không đúng!")
		}

		//Nếu các thông tin không hợp lệ trả về null
		return new Result(ResultCode.Err, "Người dùng không tồn tại!")
	}

	static async Register(userName = "", password = "", email = "", dayOfBirth = "", fullName = "", phoneNumber = "") {
		//Kieemr tra user da ton tai hay chua
		const strQueryCheckUser = `SELECT * FROM User WHERE email = "${email}"`;
		const result = await query(strQueryCheckUser);
		var resetOtp = false;
		if(result.data.length != 0) {
			if(result.data[0].status != "WT") {
				return new Result(ResultCode.Warning, "Tài khoản hoặc email đã tồn tại. Vui lòng thử lại!");
			}
			else {
				resetOtp = true;
			}
		}
		
		const otp = Math.floor(Math.random() * 99999999).toString();
		const currentDate = new Date();
		const otp_exp = currentDate.getTime() + 300000; //5p
		const hashedPassword = await UserInfor.HashPassword(password);
		var resultRegister;
		if(resetOtp == true) {
			let strQueryUpdate = "";
			if(result.data[0].user_name == userName) {
				strQueryUpdate = `UPDATE User SET password = "${hashedPassword}", 
								email = "${email}", 
								day_of_birth = "${dayOfBirth}", 
								full_name = "${fullName}", 
								phone_number = "${phoneNumber}", 
								otp = "${otp}",
								otp_exp = ${otp_exp} where user_id = ${result.data[0].user_id}`;
			}
			else {
				strQueryUpdate = `UPDATE User SET password = "${hashedPassword}", 
								user_name = "${userName}",
								email = "${email}", 
								day_of_birth = "${dayOfBirth}", 
								full_name = "${fullName}", 
								phone_number = "${phoneNumber}", 
								otp = "${otp}",
								otp_exp = ${otp_exp} where user_id = ${result.data[0].user_id}`;
			}
			resultRegister = await query(strQueryUpdate);
		}
		else {
			const strQuery = 
			`INSERT INTO User(user_name, password, email, day_of_birth, full_name, phone_number, status, otp, otp_exp)
			VALUES("${userName}", "${hashedPassword}", "${email}", "${dayOfBirth}", "${fullName}", "${phoneNumber}", "WT", "${otp}", ${otp_exp})`;
			resultRegister = await query(strQuery);
		}
		if(resultRegister.resultCode == ResultCode.Success)
			return new Result(ResultCode.Success, "Success", {userName, email, otp});
		else 
			return new Result(resultRegister.resultCode, "Lỗi quá trình đăng ký!", null);
	}

	static async ClearOTP(user_name = "") {
		const strQueryCheckUser = `UPDATE User SET otp = null AND otp_exp = null WHERE user_name = ${user_name}`;
		const result = await query(strQueryCheckUser);
		if(result.resultCode != ResultCode.Success) {
			return new Result(ResultCode.Err, "Lỗi quá trình xóa OTP");
		}
		return new Result(ResultCode.Success, "Success");
	}

	static async VerifyOTP(user_name = "", email = "", otp = 0) {
		const strQuery = `SELECT user_id, otp_exp FROM User WHERE user_name = "${user_name}" AND status = "WT" AND email = "${email}" and otp = ${otp}`;
		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success && result.data.length == 1) { 
			const otpExp = result.data[0].otp_exp;
			const currenTiem = new Date().getTime();
			if(currenTiem > otpExp) {
				this.ClearOTP(user_name);
				return new Result(ResultCode.Warning, "OTP quá hạn!");
			}
			else {
				const resultVerify = await query(`UPDATE User SET status = "OK" WHERE user_name = "${user_name}" AND email = "${email}" and otp = ${otp}`);
				const resultSetRole = Role.SetRoleForUser(result.data[0].user_id, 3);
				if(resultVerify.resultCode != ResultCode.Success || (await resultSetRole).resultCode != ResultCode.Success) {
					return new Result(ResultCode.Err, "Có lỗi trong quá trình xác thực!");
				}
				return new Result(ResultCode.Success, "Xác thực thành công!");
			}
		}

		return new Result(ResultCode.Warning, "Lỗi xác thực!")
	}

	static async ReSendOPT(user_name = "", email = "") {
		const strQuery = `SELECT user_id FROM User WHERE user_name = "${user_name}" AND email = "${email}" AND status = "WT"`;
		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success && result.data.length == 1) { 
			const otp = Math.floor(Math.random() * 99999999).toString();
			const currentDate = new Date();
			const otp_exp = currentDate.getTime() + 300000; //5p
			const strQueryUpdate = `UPDATE User SET otp = "${otp}", otp_exp = ${otp_exp} where user_id = ${result.data[0].user_id}`;
			const resultRegister = await query(strQueryUpdate);
			return new Result(ResultCode.Success, "Xác thực thành công!", otp);
		}
		console.log(result);
		return new Result(ResultCode.Warning, "Lỗi xác thực!")
	}
	//Static method for admin role ---------------------------------------
	static async AddNewRole(user_id, role_id = 3) {
		
	}

	static async AddRoleForAccount() {

	}
}