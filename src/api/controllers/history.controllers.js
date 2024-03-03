import { ResultCode } from "../interfaces/enum.interfaces.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { GetHistory } from "../services/history.services.js";

export async function _GetHistory(req, res) {
    const userId = req.user ? req.user.userId : 0;
    const result = await GetHistory(userId);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(result.data.length, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}