import { query } from "./index.models.js"; 
import { compare } from "bcrypt"; 
import { ls_Menu } from "./menu.models.js";
import { WriteErrLog } from "../helpers/index.helpers.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode, Status } from "../interfaces/enum.interfaces.js";

export class UserInfor {
	constructor(user_id = "", user_name = "", accessToken = "", role = null, email = "", day_of_birth = null, full_name = "", phone_number = "", status = Status.OK) {
		this.userId = user_id;
		this.userName = user_name;
		this.accessToken = accessToken;
		this.role = role;
		this.email = email;
		this.dayOfBirth = day_of_birth;
		this.fullName = full_name;
		this.phoneNumber = phone_number;
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
		if(result.length != 0) {
			//So sánh password
			const match = await compare(password, result[0].password);
			//Nếu như mật khẩu match
			if(match) {
				//Tạo access token
				const accessToken = await UserInfor.GenToken({
					userId: result[0].user_id, 
					userName: result[0].user_name
				});
				console.log(accessToken);
				const role = await ls_Menu.GetMenusForUser(result[0].user_id);
				//Trả về thông tin user
				return new UserInfor(
					result[0].user_id, 
					result[0].user_name, 
					accessToken,
					role,
					result[0].email, 
					result[0].day_of_birth, 
					result[0].full_name, 
					result[0].phone_number
				);
			}
		}

		//Nếu các thông tin không hợp lệ trả về null
		return null;
	}

	static async ResetPassword(userId = "", oldPassword = "", newPassword = "") {
		const strQuery = `SELECT * FROM User WHERE user_id = "${userId}" AND status = "OK"`;
		const result = await query(strQuery);
		if(result.length != 0) {
			//So sánh password
			const match = await compare(oldPassword, result[0].password);
			//Nếu như mật khẩu match
			if(match) {
				const hashedNewPassword = await this.HashPassword(newPassword);
				const strQueryUpdatePassword = `UPDATE User SET password = "${hashedNewPassword}" WHERE user_id = ${userId}`;
				const resultUpdate = await query(strQueryUpdatePassword);
				if(resultUpdate == null) {
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
		const strQueryCheckUser = `SELECT * FROM User WHERE (user_name = "${userName}" OR email = "${email}") AND (otp <> "" OR otp <> null)`;
		const result = await query(strQueryCheckUser);
		if(result.length != 0) {
			return new Result(ResultCode.Warning, "Tài khoản hoặc email đã tồn tại. Vui lòng thử lại!");
		}

		const otp = Math.floor(Math.random() * 99999999).toString();
		const currentDate = new Date();
		const otp_exp = currentDate.getTime() + 300000; //5p
		const hashedPassword = await UserInfor.HashPassword(password);
		const strQuery = 
		`INSERT INTO User(user_name, password, email, day_of_birth, full_name, phone_number, status, otp, otp_exp)
		VALUES("${userName}", "${hashedPassword}", "${email}", "${dayOfBirth}", "${fullName}", "${phoneNumber}", "WT", "${otp}", ${otp_exp})`;
		query(strQuery);
		return new Result(ResultCode.Success, "Success", {userName, email, otp});
	}

	static async ClearOTP(user_name = "") {
		const strQueryCheckUser = `UPDATE User SET otp = null AND otp_exp = null WHERE user_name = ${user_name}`;
		const result = await query(strQuery);
		if(result == null) {
			return new Result(ResultCode.Err, "Lỗi quá trình xóa OTP");
		}
		return new Result(ResultCode.Success, "Success");
	}

	static async VerifyOTP(user_name = "", email = "", otp = 0) {
		const strQuery = `SELECT * FROM User WHERE user_name = "${user_name}" AND status = "WT" AND email = "${email}" and otp = ${otp}`;
		const result = await query(strQuery);
		if(result.length != 0) { 
			const otpExp = result[0].otp_exp;
			const currenTiem = new Date().getTime();
			if(currenTiem > otpExp) {
				return new Result(ResultCode.Err, "OTP quá hạn!");
			}
			else {
				const resultVerify = await query(`UPDATE User SET status = "OK" WHERE user_name = "${user_name}" AND email = "${email}" and otp = ${otp}`);
				if(resultVerify == null) {
					return new Result(ResultCode.Err, "Có lỗi trong quá trình xác thực!");
				}
				return new Result(ResultCode.Success, "Xác thực thành công!");
			}
		}

		return new Result(ResultCode.Warning, "Không tìm thấy tài khoản trong hệ thống!")
	}
}