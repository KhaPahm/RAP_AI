import { WriteErrLog } from "../helpers/index.helpers.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { FolderInCloudinary, ImageType, ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { Animal_Red_List } from "../models/animal_red_list.models.js";
import ImageModel from "../models/image.models.js";
import { UploadImage } from "./cloudinary.services.js";

export async function AddAnimalRedList(animal = new Animal_Red_List(), buffers = []) {
    const result = await animal.AddAnimalRedList();
    if(result.resultCode != ResultCode.Success) {
        return result;
    }
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

export async function GetAnimalRedList(id = 0, status = Status.OK) {
    const result = await Animal_Red_List.GetAnimalRedList(id, status);
    return result;
}

export async function UpdateAnimalRedList(animal = new Animal_Red_List(), buffers = null) {
    const result = await animal.UpdateAnimalRedList();
    if(result.resultCode != ResultCode.Success || buffers == null) {
        return result;
    }

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