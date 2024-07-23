import { image } from "@tensorflow/tfjs-node";
import { WriteErrLog } from "../helpers/index.helpers.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { FolderInCloudinary, ImageType, ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { Contribute } from "../models/contribute.models.js";
import ImageModel from "../models/image.models.js";
import { User_Contribute } from "../models/user_contribute.models.js";
import { DeleteImage, MoveImage, UploadImage } from "./cloudinary.services.js";


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
                const newImage = new ImageModel(0, path, path, newContribute.animal_name, ImageType.Contribute, Status.WT, null, null, null, contributeId);
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

export async function UpdateContributeById(contribute_id = 0, status = Status.OK, animalRedListI = 0, lsImageAccept = "") {
    const resultUpdateContribute =  await Contribute.UpdateContributeStatusById(contribute_id, status);

    if(resultUpdateContribute.resultCode == ResultCode.Err) {
        return resultUpdateContribute;
    }

    if(status == Status.XX) {
        lsImageAccept = "";
    }
    const lsImage = await ImageModel.GetImageByContributeId(contribute_id);
    if(lsImage.resultCode == ResultCode.Success) {
        var listImageAccept = lsImageAccept.split("-");
        var lsImageAcceptFail = "";
        var lsImageRejectFail = "";



        lsImage.data.forEach(async (image) => {
            if(listImageAccept.includes(image.image_id.toString())) {
                if(image.image_public_path.includes("Contribute")){
                    await MoveImage(image.image_public_path, `${FolderInCloudinary.ModelsImages}/${animalRedListI}`)
                    .then(async (result) => {
                        await ImageModel.UpdateContributeImage(image.image_id, result.url, result.url, "OK");
                    })
                    .catch(() => {
                        lsImageAcceptFail = image.image_id.toString() + "-";
                    })
                }
            }
            else {
                if(image.image_public_path.includes("ModelsImages")) {
                    await MoveImage(image.image_public_path, `${FolderInCloudinary.ContributeImages}`)
                    .then(async (result) => {
                        await ImageModel.UpdateContributeImage(image.image_id, result.url, result.url, "WT");
                    })
                    .catch(() => {
                        lsImageRejectFail = image.image_id.toString() + "-";
                    })
                }
                else if(image.status != "WT") {
                    await ImageModel.UpdateContributeImage(image.image_id, image.image_public_path, image.image_local_path, "WT");
                }
            }
        });

        if(lsImageAcceptFail == "" && lsImageRejectFail == "") {
            return new Result(ResultCode.Success, "Cập nhật thành công!", null);
        }
        else {
            return new Result(ResultCode.Warning, "Lỗi cập nhật một số ảnh!", {lsImageAcceptFail, lsImageRejectFail});
        }
    }

    return resultUpdateContribute;
}