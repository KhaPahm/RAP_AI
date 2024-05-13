import { join } from "path";
import { ConverDateTimeToString } from "../helpers/string.helpers.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { Contribute } from "../models/contribute.models.js";
import { AddContribute, GetContributeById } from "../services/contribute.services.js";

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
    if(contributeId == 0) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const result = await GetContributeById(contributeId);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}