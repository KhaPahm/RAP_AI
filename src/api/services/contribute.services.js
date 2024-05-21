import { WriteErrLog } from "../helpers/index.helpers.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { FolderInCloudinary, ImageType, ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { Contribute } from "../models/contribute.models.js";
import ImageModel from "../models/image.models.js";
import { User_Contribute } from "../models/user_contribute.models.js";
import { DeleteImage, UploadImage } from "./cloudinary.services.js";

export async function AddContribute(newContribute = new Contribute(), buffers, userId = 0) {
    const result = await newContribute.AddContribute();
    if(result.resultCode != ResultCode.Success) {
        return result;
    }

    const contributeId = newContribute.contribute_id;

    let isErro = false;
    let fileName = "";

    buffers.forEach(buffer => {
        const promiseUpload = UploadImage(FolderInCloudinary.ContributeImages, buffer.buffer);
        promiseUpload
            .then(async (value) => {
                fileName = value.public_id;
                var path = value.url;
                const newImage = new ImageModel(0, path, path, newContribute.animal_name, ImageType.Contribute, Status.OK, null, null, null, contributeId);
                const resultAddImage = await newImage.AddNewImage();
                if(resultAddImage.resultCode != ResultCode.Success) {
                    isErro = true;
                }
            })
            .catch((err) => {
                isErro = true;
                WriteErrLog(err);
            });
    })
    
    if(isErro){
        newContribute.DeleteContribute();
        return new Result(ResultCode.Err, "Lỗi quá trình cập nhật ảnh!")
    }

    const userContribute = new User_Contribute(contributeId, userId);
    const userContributeResult = await userContribute.AddUserContribute();
    if(userContributeResult.resultCode != ResultCode.Success) {
        await ImageModel.DeleteImageByContributeId(contributeId);
        await newContribute.DeleteContribute();
        const promiseDelete = DeleteImage(FolderInCloudinary.ContributeImages, fileName);
        await promiseDelete
            .catch((err) => {
                WriteErrLog(err);
            });

        return new Result(ResultCode.Err, "Lỗi quá trình tạo góp ý!"); 
    }

    return new Result(ResultCode.Success, "Success", null);

}

export async function GetContributeById(contribute_id = 0, user_id = 0) {
    return await Contribute.GetContributeById(contribute_id, user_id);
}