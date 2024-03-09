import { ResultCode, Status } from "../interfaces/enum.interfaces.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { GetHistory, SetStatusForHistory } from "../services/history.services.js";

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

export async function _DeleteHistory(req, res) {
    const userId = req.user ? req.user.userId : 0;
    const animalRedListId = req.body.animalRedListId;
    const result = await SetStatusForHistory(userId, animalRedListId, Status.XX);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(result.data.length, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}