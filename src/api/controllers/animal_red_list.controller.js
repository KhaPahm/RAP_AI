import { ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { GetAnimalRedList, PredictAnimal, SearchAnimalRedList, UpdateAnimalRedList } from "../services/animal_red_list.models.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { Animal_Red_List } from "../models/animal_red_list.models.js";
import { AddAnimalRedList } from "../services/animal_red_list.models.js";
import { Animal_Red_List_New } from "../models/animal_red_list_update_new.model.js";
import { WriteErrLog } from "../helpers/index.helpers.js";

export async function _AddAnimalRedList(req, res) {
    const VNName = req.body.VNName;
    const ENName = req.body.ENName;
    const SCName = req.body.SCName;
    const animalInfor = req.body.animalInfor;
    const predictID = req.body.predictID;
    const status = req.body.status || "OK";
    const animalTypeId = Number(req.body.animalTypeId) || 0;
    const conservationStatusID = Number(req.body.conservationStatusID) || 0;
    const buffers = req.files;

    if(animalTypeId == 0 || conservationStatusID == 0 || !VNName || !ENName || !SCName || !animalInfor || !predictID) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const animalRedList = new Animal_Red_List_New(0, VNName, ENName, SCName, animalInfor, status, predictID, animalTypeId, conservationStatusID);
        const result = await AddAnimalRedList(animalRedList, buffers);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _SearchAnimalRedList(req, res) {
    const name = req.body.name ?? "";
    
    const result = await SearchAnimalRedList(name);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(result.data.length, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}

export async function _GetAnimalRedList(req, res) {
    const userId = req.user ? req.user.userId : 0;
    const animalRedListId = req.body.animalRedListId || 0;
    const status = req.body.status || Status.OK;

    const result = await GetAnimalRedList(animalRedListId, status, userId);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(result.data.length ? result.data.length : 1, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}

export async function _UpdateAnimalRedList(req, res) {
    const id = Number(req.body.animal_red_list_id) || null;
    const VNName = req.body.vn_name;
    const ENName = req.body.en_name;
    const SCName = req.body.sc_name;
    const animalInfor = req.body.animal_infor;
    const predictID = Number(req.body.predict_id) || null;
    const status = req.body.status || "OK";
    const animalTypeId = Number(req.body.animal_type_id) || 0;
    const conservationStatusID = Number(req.body.conservation_status_id) || 0;
    var buffers = req.files || null;
    if(buffers != null && buffers.length == 0) {
        buffers = null;
    }
    
    if(!id || animalTypeId == 0 || conservationStatusID == 0 || !VNName || !ENName || !SCName || !animalInfor || !predictID) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const animal = new Animal_Red_List_New(id, VNName, ENName, SCName, animalInfor, status, predictID, animalTypeId, conservationStatusID);
        const result = await UpdateAnimalRedList(animal, buffers);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}
 
export async function _PredictAnimal(req, res) {
    const userId = req.user ? req.user.userId : 0;
    if(!req.file) return res.json(new ApiRespone.Err(100, "Dữ liệu không phù hợp!"))
    const buffer = req.file.buffer;
    const result = await PredictAnimal(buffer, userId);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(1, result.data));
    }
    else if(result.resultCode == ResultCode.Warning) {
        res.json(new ApiRespone(0, result.data, 50, result.message))
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}