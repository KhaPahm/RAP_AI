import { buffer, imag } from "@tensorflow/tfjs-node";
import { WriteErrLog } from "../helpers/index.helpers.js";
import { FolderInCloudinary } from "../interfaces/enum.interfaces.js";
import { UploadImage, UpdateImageUsingURL, DeleteImage, DeleteImageUsingSourcePath } from "../services/cloudinary.services.js";
import { predict } from "../test/test.redict.js";
import { SendingMail, SendingMailAttachment } from "../services/mail.services.js";
import path from "path";

export async function test(req, res, next) {

    const urlPath = req.body.urlPath;
    const archivePath = "RAP/Test/From";
    const sourceUrl = "RAP" + urlPath.split("RAP")[1].split(".")[0];
    // var imageId = path.basename(urlPath).split(".")[0];

    UpdateImageUsingURL(urlPath, archivePath)
    .then((result) => {
        console.log(result.secure_url);
        DeleteImageUsingSourcePath(sourceUrl);
    })

    return;
}