import { ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { GetAnimalRedList, UpdateAnimalRedList } from "../services/animal_red_list.models.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { Animal_Red_List } from "../models/animal_red_list.models.js";

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
        const animalRedList = new Animal_Red_List(0, VNName, ENName, SCName, animalInfor, predictID, status, animalTypeId, conservationStatusID);
        const result = await AddAnimalRedList(animalRedList, buffers);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _GetAnimalRedList(req, res) {
    const animalRedListId = req.body.animalRedListId || 0;
    const status = req.body.status || Status.OK;

    const result = await GetAnimalRedList(animalRedListId, status);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(1, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}

export async function _UpdateAnimalRedList(req, res) {
    const id = req.body.animalRedListId;
    const VNName = req.body.VNName;
    const ENName = req.body.ENName;
    const SCName = req.body.SCName;
    const animalInfor = req.body.animalInfor;
    const predictID = req.body.predictID;
    const status = req.body.status || "OK";
    const animalTypeId = Number(req.body.animalTypeId) || 0;
    const conservationStatusID = Number(req.body.conservationStatusID) || 0;
    var buffers = req.files || null;
    if(buffers.length == 0) {
        buffers = null;
    }
    
    if(!id || animalTypeId == 0 || conservationStatusID == 0 || !VNName || !ENName || !SCName || !animalInfor || !predictID) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const animal = new Animal_Red_List(id, VNName, ENName, SCName, animalInfor, predictID, status, animalTypeId, conservationStatusID);
        const result = await UpdateAnimalRedList(animal, buffers);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}