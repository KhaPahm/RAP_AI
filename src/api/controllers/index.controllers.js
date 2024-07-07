import { buffer, imag } from "@tensorflow/tfjs-node";
import { WriteErrLog } from "../helpers/index.helpers.js";
import { FolderInCloudinary } from "../interfaces/enum.interfaces.js";
import { MoveImage, UploadImage, UpdateImageUsingURL, DeleteImage, DeleteImageUsingSourcePath, CreateNewFolder } from "../services/cloudinary.services.js";
import { predict } from "../test/test.redict.js";
import { SendingMail, SendingMailAttachment } from "../services/mail.services.js";
import path from "path";
import { query } from "../models/index.models.js";

export async function test(req, res, next) {

    const urlPath = req.body.urlPath;
    // const archiveFolder = "RAP/Test/From";
    const archiveFolder = req.body.archiveFolder;
    // const sourceUrl = "RAP" + urlPath.split("RAP")[1].split(".")[0];
    // var imageId = path.basename(urlPath).split(".")[0];
    var dt;
    const result = MoveImage(urlPath, archiveFolder);
    await result
        .then((data) => {
            dt = data;
        })
        .catch((err) => {
            console.log(err);
        });

    console.log("dt", dt.url);

    var a = [1,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,31,32,33,34];
    a.forEach((v) => {
        CreateNewFolder(FolderInCloudinary.ModelsImages, v.toString())
    })

    // const result = await query(`SELECT image_id, image_local_path, image_public_path, image_type, status FROM Image WHERE contribute_id = ${13}`);

    // console.log(result);
    // res.write("<h1>Hello</h1>");
}