import { buffer } from "@tensorflow/tfjs-node";
import { WriteErrLog } from "../helpers/index.helpers.js";
import { FolderInCloudinary } from "../interfaces/enum.interfaces.js";
import { UploadImage } from "../services/cloudinary.services.js";
import { predict } from "../test/test.redict.js";

export async function test(req, res, next) {

    const buffer = req.file.buffer;
    const re = await predict(buffer);
    

    // let result = await UploadImage(FolderInCloudinary.ModelsImages, req.file.buffer);
    // console.log(result);
    // const buffers = req.files;
    // console.log(buffers);
    // var isErro = false;
    // buffers.forEach(buffer => {
    //     const promiseUpload = UploadImage(FolderInCloudinary.RedListImages,  buffer.buffer);
    //     promiseUpload
    //         .then((value) => {
    //             console.log(value);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             isErro = true;
    //             WriteErrLog(err);
    //         });
    // });
}