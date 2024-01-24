import {v2 as cloudinary} from "cloudinary";
import streamifier from "streamifier";
import { FolderInCloudinary } from "../interfaces/enum.interfaces.js";
import { CloudinaryConfig } from "../../config/cloudinary.config.js";
cloudinary.config(CloudinaryConfig);

export async function UploadImage(folderPath = FolderInCloudinary.ModelsImages, buffer) {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
        { folder: folderPath },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

      streamifier.createReadStream(buffer).pipe(stream);
    });
}