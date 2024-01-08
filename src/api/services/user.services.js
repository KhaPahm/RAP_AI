
import { GetAllUser as _GetAllUser} from "../models/user.models.js";
import { UserInfor } from "../models/user.models.js";
export async function GetAllUser() {
	return _GetAllUser();
}
export async function Login(userName = "", password = "") {
	const _userInfor = UserInfor.GetData(userName, password);
	return _userInfor;
}