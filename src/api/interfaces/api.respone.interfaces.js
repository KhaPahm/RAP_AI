import { ResultCode } from "./enum.interfaces.js";

export default class ApiRespone {
	constructor(totalResult = 0, data = null, resultCode = 0, message = "Successful!") {
		this.resultCode = resultCode;
		this.totalResult = totalResult;
		this.data = data;
		this.message = message;
	}

	static Success(totalResult, data) {
		return new ApiRespone(totalResult, data, 0, "Successful");
	}

	static Err(resultCode = 0, message = "Successful!") {
		return new ApiRespone(0, null, resultCode, message);
	}
}

export class Result {
	constructor(resultCode = ResultCode.Success, message = "") {
		this.resultCode = resultCode
		this.message = message;
	}
}