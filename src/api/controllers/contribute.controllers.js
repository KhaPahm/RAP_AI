import { join } from "path";
import { ConverDateTimeToString } from "../helpers/string.helpers.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { Contribute } from "../models/contribute.models.js";
import { AddContribute, GetContributeById, UpdateContributeById } from "../services/contribute.services.js";

export async function _AddNewContribute(req, res) { 
    const name = req.body.name || "";
    const description = req.body.description || "";
    const buffers = req.files || null
    const status = Status.WT;
    const userId  = req.user.userId;

    if(name == "" || description == "" || buffers == null) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    } else {
        const contribute = new Contribute(0, name, description, ConverDateTimeToString(new Date), status)
        const result = await AddContribute(contribute, buffers, userId);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _GetContributeById(req, res) {
    const contributeId = req.body.contributeId || 0;
    const userId  = req.user.userId;
    const role = req.user.role;

    var result;
    if(role != 3) {
        result = await GetContributeById(contributeId);
    }
    else {
        result = await GetContributeById(contributeId, userId);
    }
    
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(1, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}

export async function _UpdateContribute(req, res) {
    const contributeId = req.body.contributeId || 0;
    const status = req.body.status || "";
    const animalRedListID = req.body.animalRedListID || 0; //Dùng để lưu vào folder
    const lsImageAccept = req.body.lsImageAccept || "";
    const role = req.user.role;

    if(status == "OK" && animalRedListID == 0 && lsImageAccept != ""){
        res.json(ApiRespone.Err(100, "Không được để trống animalRedListID!"));
    }
    else if(contributeId == 0 || status == "" ) {
        res.json(ApiRespone.Err(100, "Không được để trống contributeId!"));
    }
    else {
        if(role == 3 && status == "OK") {
            res.json(ApiRespone.Err(100, "Bạn không có quyền xác thực đóng góp!"));
        }
        else{
            var result = await UpdateContributeById(contributeId, status, animalRedListID, lsImageAccept);
            if(result.resultCode == ResultCode.Success) {
                res.json(ApiRespone.Success(1, result.data));
            }
            else {
                res.json(ApiRespone.Err(100, result.message));
            }
        }
    }
}