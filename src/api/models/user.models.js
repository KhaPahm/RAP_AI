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
	constructor(user_id = "", user_name = "", accessToken = "", role = null, email = "", day_of_birth = null, full_name = "", phone_number = "", avt = "", status = Status.OK, role_id = 0) {
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
		this.role_id = role_id;
	}

	set SetToken(accessToken) {
		this.accessToken = accessToken;
	}

	set SetRole(role = {}) {
		this.role = role;
	}

	static async GenToken (payload, accessToken = true, exp = "1d", tempToken = false) {
		const options = {
			// expiresIn: accessToken ? "10m" : "14d"
			expiresIn: exp
		};
	
		var secrectSign = "";
		if(tempToken) {
			secrectSign = process.env.JWT_SIGN_TEMP_ACCESS_KEY;
		}
		else {
			secrectSign = accessToken ? 
				process.env.JWT_SIGN_ACCESS_KEY : process.env.JWT_SIGN_REFRESH_KEY;
		}
		
	
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

	static async Login(user_name = "", password = "", isMobile = false) {		
		const strQuery = `SELECT u.*, ur.role_id FROM User u left join User_Role ur ON u.user_id = ur.user_id WHERE user_name = "${user_name}" AND status <> "WT"`;
		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success && result.data.length == 1) {
			if(result.data[0].status == "XX") {
				return new Result(ResultCode.Warning, "Tài khoản của bạn đã bị khóa vui lòng liên hệ với đội ngũ phát triển để để biết thêm chi tiết!", null);
			}
			if(result.data[0].role_id == 3 && isMobile == false) {
				return new Result(ResultCode.Warning, "Tài khoản hoặc mật khẩu không đúng!", null);
			}

			//So sánh password
			const match = await compare(password, result.data[0].password);
			//Nếu như mật khẩu match
			if(match) {
				const loginDate = Date.now();
				//Tạo access token
				const role = await Menu.GetListMenuPath(result.data[0].user_id);
				const accessToken = await UserInfor.GenToken({
					userId: result.data[0].user_id, 
					userName: result.data[0].user_name, 
					loginDate: loginDate,
					role: role
				});
				const avt = await ImageModel.GetImage(result.data[0].avt);
				
				//Tạo refreshToken
				const refreshToken = await UserInfor.GenToken({
					userId: result.data[0].user_id, 
					userName: result.data[0].user_name, 
					loginDate: loginDate,
				}, false, "14d");

				await query(`UPDATE User SET refresh_token = "${refreshToken}" WHERE user_id = ${result.data[0].user_id}`);

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
					avt.data == null ? null : avt.data[0].image_public_path,
					result.data[0].status,
					result.data[0].role_id,
				));
			} else {
				return new Result(ResultCode.Warning, "Tài khoản hoặc mật khẩu không đúng!", null);
			}
		}
		else if(result.resultCode == ResultCode.Success && result.data.length == 0) {
			return new Result(ResultCode.Warning, "Tài khoản hoặc mật khẩu không đúng!", null);
		}

		return new Result(ResultCode.Err, "Lỗi quá trình đăng nhập!", null);
	}

	static async Logout(userId) {
		const strQuery = `UPDATE User SET refresh_token = "" WHERE user_id = ${userId}`;
		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success) {
			return new Result(ResultCode.Success, "Đăng xuất thành công", null);
		}
		else {
			return new Result(ResultCode.Warning, "Có lỗi trong quá trình đăng xuất", null);
		}
	}

	static async ExpandToken(userId, dateLogin) {
		const strQuery = `Select refresh_token, user_name from User WHERE user_id = ${userId}`;
		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success) {
			const refreshToken = result.data[0].refresh_token;

			if(refreshToken == "") 
				return new Result(ResultCode.Err, "Invalid", null);

			const payloafRefresh = await jwt.verify(refreshToken, process.env.JWT_SIGN_REFRESH_KEY);
			if(payloafRefresh == "Expired") {
				return new Result(ResultCode.Err, "Expried", null);
			}
			else {
				if(dateLogin < payloafRefresh.loginDate) {
					return new Result(ResultCode.Err, "Invalid", null);
				}
			}
			const role = await Menu.GetListMenuPath(userId);
			const accessToken = await UserInfor.GenToken({
				userId: userId, 
				userName: result.data[0].user_name, 
				loginDate: Date.now(),
				role: role
			});

			return new Result(ResultCode.Success, "Gia hạn thành công", {newToken: accessToken});
		}
		else {
			return new Result(ResultCode.Warning, "Lỗi xác thực", null);
		}
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
		
		const otp = Math.floor(Math.random() * 9999).toString();
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
			const otp = Math.floor(Math.random() * 9999).toString();
			const currentDate = new Date();
			const otp_exp = currentDate.getTime() + 300000; //5p
			const strQueryUpdate = `UPDATE User SET otp = "${otp}", otp_exp = ${otp_exp} where user_id = ${result.data[0].user_id}`;
			const resultRegister = await query(strQueryUpdate);
			return new Result(ResultCode.Success, "Xác thực thành công!", otp);
		}
		return new Result(ResultCode.Warning, "Lỗi xác thực!")
	}

	async Update() {
		const strQuery = `UPDATE User SET 
									full_name = "${this.fullName}",
									phone_number = "${this.phoneNumber}",
									day_of_birth = "${this.dayOfBirth}"
							WHERE user_id = ${this.userId};`;
		const result = await query(strQuery);
		
		return result;
	}

	static async UpdateAvt(userId, avtId) {
		const strQuery = `UPDATE User SET 
								avt = "${avtId}"
							WHERE user_id = ${userId};`
		const result = await query(strQuery);

		return result;
	}

	//Static method for admin role ---------------------------------------
	static async AddNewRole(user_id, role_id = 3) {
		
	}

	static async AddRoleForAccount() {

	}

	static async GetUsersList(status = "") {
		const strQuery = `select u.user_id, u.user_name, u.email, u.day_of_birth, 
							u.status, u.full_name, u.phone_number, r.role_id, 
							r.role_name, r.role_description, i.image_public_path as avt
						from User u 
						inner join User_Role ur on u.user_id = ur.user_id
						left join Role r on ur.role_id = r.role_id
						left join Image i on u.avt = i.image_id
						where r.status ${status == "" ? `<> "XX"` : `= "${status}"`} and r.role_id <> 1;`;

		const result = await query(strQuery);
		return result;
	}

	static async UpdateUserStatus(userId = 0, status = Status.OK) {
		const strQuery = `UPDATE User SET status = "${status}" WHERE user_id = ${userId};`;

		const result = await query(strQuery);
		return result;
	}

	static async CreateOfficerAccount(userName = "", email = "", dayOfBirth = "", fullName = "", phoneNumber = "") {
		//Kieemr tra user da ton tai hay chua
		const strQueryCheckUser = `SELECT * FROM User WHERE email = "${email}"`;
		const result = await query(strQueryCheckUser);
		if(result.data.length != 0) {
			return new Result(ResultCode.Warning, "Tài khoản hoặc email đã tồn tại. Vui lòng thử lại!");
		}

		const password = this.generatePassword();
		const hashedPassword = await UserInfor.HashPassword(password);
		
		const strQuery = 
			`INSERT INTO User(user_name, password, email, day_of_birth, full_name, phone_number, status)
			VALUES("${userName}", "${hashedPassword}", "${email}", "${dayOfBirth}", "${fullName}", "${phoneNumber}", "OK")`;

		const resultRegister = await query(strQuery);

		if(resultRegister.resultCode == ResultCode.Success)
		{
			const resultSetRole = Role.SetRoleForUser(resultRegister.data.insertId, 2);
			return new Result(ResultCode.Success, "Success", {userName: userName, password: password});
		}
		else 
			return new Result(resultRegister.resultCode, "Lỗi quá trình đăng ký!", null);
	}

	static generatePassword() {
		var length = 8,
			charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			retVal = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		return retVal;
	}

	//Quên mật khẩu
	static async CheckUserForgotPassword(userName = "") {
		const strQuery = `SELECT u.user_id, u.email FROM User u WHERE user_name = "${userName}" AND status <> "WT"`;
		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success && result.data.length == 1) {
			if(result.data[0].status == "XX") {
				return new Result(ResultCode.Warning, "Tài khoản của bạn đã bị khóa vui lòng liên hệ với đội ngũ phát triển để để biết thêm chi tiết!", null);
			}

			var otp = "";
			for(var i = 0; i < 4; i++) {
				otp = `${otp}${Math.floor(Math.random() * 9).toString()}`;
			}
			const currentDate = new Date();
			const otp_exp = currentDate.getTime() + 300000; //5p

			const strQueryUpdate = `UPDATE User SET otp = "${otp}",
													otp_exp = ${otp_exp} where user_id = ${result.data[0].user_id}`;

			const resultUpdateOTP = await query(strQueryUpdate);

			const tempAccessToken = await UserInfor.GenToken({
				userId: result.data[0].user_id, 
				userName: userName,
				email: result.data[0].email,
				otp
			}, true, "5m", true);

			return new Result(ResultCode.Success, "Success", {
				user_name: userName,
				user_id: result.data[0].user_id,
				email: result.data[0].email,
				otp: otp,
				accessToken: tempAccessToken
			});
		}
		else if(result.resultCode == ResultCode.Success && result.data.length == 0) {
			return new Result(ResultCode.Warning, "Tài khoản hoặc mật khẩu không đúng!", null);
		}

		return new Result(ResultCode.Err, "Lỗi quá trình đăng nhập!", null);
	}

}