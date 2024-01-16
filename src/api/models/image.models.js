import { Result } from "../interfaces/api.respone.interfaces.js";
import { ResultCode } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js"; 

export default class ImageModel {
    constructor(image = {}) {
        this.image_id = image.image_id;
        this.image_local_path = image.image_local_path;
        this.image_public_path = image.image_public_path;
        this.description = image.description;
        this.image_type = image.image_type;
        this.status = image.status;
    }

    //AVT - ảnh đại diện
    //RPT - ảnh report
    //AIC - ảnh dự đoán
    //SYS - ảnh hệ thống
    static async GetImage(id = 1, type = "AVT") {
        const images = await query(`SELECT * FROM Image WHERE image_id = ${id} AND image_type = "${type}"`)
        if(images.resultCode == ResultCode.Success) {
            if(images.data.length == 0) 
                return new Result(ResultCode.Warning, "Không tìm thấy ảnh!");
            const listImage = [];
            images.data.forEach(image => {
                listImage.push(new ImageModel(image));
            });
            return images.data = listImage;
        }
        return images;
    }
}