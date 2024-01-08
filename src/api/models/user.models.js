import { query } from "./index.models.js"; 
import { compare } from "bcrypt"; 
import { GenToken } from "../helpers/jwt.helpers.js";

export async function GetAllUser() {
	const strQuery = "SELECT * FROM User";
	const result = await query(strQuery);
	return result;
}
export async function Login(user_name = "") {
	const strQuery = `SELECT * FROM User WHERE user_name = "${user_name}" AND status = "OK"`;
	const result = await query(strQuery);
	return result;
}

export class UserInfor {
	constructor(user_id = "", user_name = "", accessToken = "", email = "", day_of_birth = null, full_name = "", phone_number = "") {
		this.userId = user_id;
		this.userName = user_name;
		this.accessToken = accessToken;
		this.role = null;
		this.email = email;
		this.dayOfBirth = day_of_birth;
		this.fullName = full_name;
		this.phoneNumber = phone_number;
	}

	set SetToken(accessToken) {
		this.accessToken = accessToken;
	}

	set SetRole(role = {}) {
		this.role = role;
	}

	static async GetData(user_name = "", password) {
		const strQuery = `SELECT * FROM User WHERE user_name = "${user_name}" AND status = "OK"`;
		const result = await query(strQuery);
		if(result.length != 0) {
			//So sánh password
			const match = await compare(password, result[0].password);
			//Nếu như mật khẩu match
			if(match) {
				//Tạo access token
				const accessToken = await GenToken({
					userId: result[0].user_id, 
					userName: result[0].user_name
				});
				//Trả về thông tin user
				return new UserInfor(
					result[0].user_id, 
					result[0].user_name, 
					accessToken,
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
}