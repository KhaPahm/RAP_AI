import { WriteErrLog } from "../helpers/index.helpers.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { AnimalSearchTypes, FolderInCloudinary, ImageType, ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { Animal_Red_List } from "../models/animal_red_list.models.js";
import { History_Watch } from "../models/history_watch.js";
import ImageModel from "../models/image.models.js";
import { UploadImage, CreateNewFolder } from "./cloudinary.services.js";
import { ConverDateTimeToString } from "../helpers/string.helpers.js";
import { Animal_Red_List_New } from "../models/animal_red_list_update_new.model.js";


export async function AddAnimalRedList(animal = new Animal_Red_List_New(), buffers = []) {
    const result = await animal.AddAnimalRedList(animal);
    if(result.resultCode != ResultCode.Success) {
        return result;
    }

    //Tạo folder moi trong cloudinary
    CreateNewFolder(FolderInCloudinary.ModelsImages, animal.predict_id).catch((err) => WriteErrLog(err));

    const idNewAnimalInRedList = result.data.animal_red_list_id;

    var isErro = false;

    buffers.forEach(buffer => {
        const promiseUpload = UploadImage(FolderInCloudinary.RedListImages,  buffer.buffer);
        promiseUpload
            .then(async (value) => {
                var path = value.url;
                const newImage = new ImageModel(0, path, path, animal.vn_name, ImageType.System, Status.OK, idNewAnimalInRedList);
                const resultAddImage = await newImage.AddNewImage();
                if(resultAddImage.resultCode != ResultCode.Success) {
                    isErro = true;
                }
            })
            .catch((err) => {
                isErro = true;
                WriteErrLog(err);
            });
    });

    if(isErro)
        return new Result("Erro", "Lỗi trá trình cập nhật ảnh!")
    
    const imagesResult = await ImageModel.GetImageByAnimalRedList(animal.animal_red_list_id);

    animal.images = imagesResult.data;
    return new Result(ResultCode.Success, "Success", animal);
}

export async function GetAnimalRedList(id = 0, status = Status.OK, user_id = 0) {
    const result = await Animal_Red_List.GetAnimalRedList(id, status);
    if(id != 0 && user_id != 0 && result.resultCode == ResultCode.Success) {
        const history = new History_Watch(user_id, result.data.animal_red_list_id, ConverDateTimeToString(new Date), AnimalSearchTypes.Search, null);
        if(await history.CheckHistory()) {
            await history.UpdateHistory();
        } else {
            await history.AddNewHistory();
        }
    }
    return result;
}

export async function UpdateAnimalRedList(animal = new Animal_Red_List_New(), buffers = null) {
    const result = await animal.UpdateAnimalRedList();

    CreateNewFolder(FolderInCloudinary.ModelsImages, animal.predict_id).catch((err) => WriteErrLog(err));

    if(result.resultCode != ResultCode.Success || buffers == null) {
        return result;
    }
    //Tạo folder moi trong cloudinary

    const idNewAnimalInRedList = animal.animal_red_list_id;
    var isErro = false;

    buffers.forEach(buffer => {
        const promiseUpload = UploadImage(FolderInCloudinary.RedListImages,  buffer.buffer);
        promiseUpload
            .then(async (value) => {
                var path = value.url;
                const newImage = new ImageModel(0, path, path, animal.vn_name, ImageType.System, Status.OK, idNewAnimalInRedList);
                const resultAddImage = await newImage.AddNewImage();
                if(resultAddImage.resultCode != ResultCode.Success) {
                    isErro = true;
                }
            })
            .catch((err) => {
                isErro = true;
                WriteErrLog(err);
            });
    });

    if(isErro)
        return new Result("Erro", "Lỗi trá trình cập nhật ảnh!")
    
    const imagesResult = await ImageModel.GetImageByAnimalRedList(animal.animal_red_list_id);
    animal.images = imagesResult.data;
    return new Result(ResultCode.Success, "Success", animal);
}

export async function PredictAnimal(buffer, user_id = 0) {
    const result = await Animal_Red_List.PredictAnimal(buffer);
    if(user_id != 0 && result.resultCode == ResultCode.Success) {
        const history = new History_Watch(user_id, result.data[0].animal_red_list_id, ConverDateTimeToString(new Date), "AIC", result.data[1]);
        if(await history.CheckHistory()) {
            await history.UpdateHistory();
        } else {
            await history.AddNewHistory();
        }
    }

    if(result.resultCode == ResultCode.Success) {
        const promiseUpload = UploadImage(`${FolderInCloudinary.ModelsImages}/${result.data[0].predict_id}`, buffer);
        promiseUpload
        .then(async (value) => {
            var path = value.url;
            const newImage = new ImageModel(0, path, path, `PredictRate: ${result.data[1]}`, ImageType.Redict, Status.OK, result.data[0].animal_red_list_id);
            const resultAddImage = await newImage.AddNewImage();
            if(resultAddImage.resultCode != ResultCode.Success) {
                WriteErrLog(err);
            }
        })
        .catch((err) => {
            WriteErrLog(err);
        });
    }
    
    return new Result(result.resultCode, result.message, result.data[0]);
}

export async function SearchAnimalRedList(name = "") {
    const animals = await Animal_Red_List.SearchAnimalRedList(name);
    return animals;
}