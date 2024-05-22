import {v2 as cloudinary} from "cloudinary";
import streamifier from "streamifier";
import { FolderInCloudinary, ImageType, Status } from "../interfaces/enum.interfaces.js";
import { CloudinaryConfig } from "../../config/cloudinary.config.js";
import ImageModel from "../models/image.models.js";
import { ConverDateTimeToString } from "../helpers/string.helpers.js";
import { UserInfor } from "../models/user.models.js";
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

export async function UpdateAvt(folderPath, buffer, userId) {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
      { folder: folderPath },
        async (error, result) => {
          if (result) {
            const newImage = await new ImageModel(0, result.url, result.url, `${userId} - ${ConverDateTimeToString()}`, ImageType.Avata, Status.OK, null, userId);
            const resultAddImge = await newImage.AddNewImage();
				    const resultUpdateAvt = UserInfor.UpdateAvt(userId, resultAddImge.data.image_id);
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(stream);
    });
}

export async function DeleteImage(folderPath, fileName) {
  var path = folderPath + "/" + fileName;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy( 
      fileName, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  })
}

export async function UpdateImageUsingURL(url, archiveFolderPath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(url, 
      { folder: archiveFolderPath },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
    )
  });
}

export async function CreateNewFolder(parentPath, newFolderName) {
  return new Promise((resolve, reject) => {
    cloudinary.api.create_folder(`${parentPath}/${newFolderName}`)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      })
  });
}