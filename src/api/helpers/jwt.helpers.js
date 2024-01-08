import { WriteErrLog } from "./index.helpers.js";
// eslint-disable-next-line no-undef
import jwt from "jsonwebtoken";

export async function GenToken (payload, accessToken = true) {
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

