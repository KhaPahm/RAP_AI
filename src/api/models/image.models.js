import { Result } from "../interfaces/api.respone.interfaces.js";
import { ImageType, ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js"; 

export default class ImageModel {
    constructor(image_id = 0, image_local_path ="", image_public_path = "", description = "", image_type  = "", status = Status.OK, animal_red_list_id = null, user_id = null, report_id = null, contribute_id = null) {
        this.image_id = image_id;
        this.image_local_path = image_local_path;
        this.image_public_path = image_public_path;
        this.description = description;
        this.image_type = image_type;
        this.status = status;
        this.animal_red_list_id = animal_red_list_id;
        this.user_id = user_id;
        this.report_id = report_id;
        this.contribute_id = contribute_id;
    }

    //AVT - ảnh đại diện
    //RPT - ảnh report
    //AIC - ảnh dự đoán
    //SYS - ảnh hệ thống
    static async GetImage(id = 1, type = ImageType.Avata) {
        const images = await query(`SELECT * FROM Image WHERE image_id = ${id} AND image_type = "${type}" and status = "OK"`)
        if(images.resultCode == ResultCode.Success) {
            if(images.data.length == 0) 
                return new Result(ResultCode.Warning, "Không tìm thấy ảnh!");
            
            return images;
        }
        return images;
    }

    async AddNewImage() {
        const strQuery = `INSERT INTO Image(image_local_path, image_public_path, image_type, description, status, animal_red_list_id, user_id, report_id, contribute_id) 
                        VALUES ("${this.image_local_path}", "${this.image_public_path}", "${this.image_type}", "${this.description}", "${this.status}", ${this.animal_red_list_id}, ${this.user_id}, ${this.report_id}, ${this.contribute_id})`;
        
        // console.log(strQuery);
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.image_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm ảnh thành công!", this);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    async UpdateStatus() {
        const strQuery = `UPDATE Image SET status = "${this.status}" 
                            WHERE image_id = ${this.image_id}`;
        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            return new Result(ResultCode.Success, "Chỉnh trạng thái ảnh thành công!", this);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    static async GetImageByAnimalRedList(animal_red_list_id = 0, status = Status.OK) {
        const result = await query(`SELECT image_id, image_local_path, image_public_path, description, image_type, status FROM Image WHERE animal_red_list_id = ${animal_red_list_id} AND image_type = "${ImageType.System}" and status = "${status}"`);

        return result;
    }

    static async GetImageByReportId(report_id = 0, status = Status.OK) {
        const result = await query(`SELECT image_id, image_local_path, image_public_path, description, image_type, status FROM Image WHERE report_id = ${report_id} AND image_type = "${ImageType.Report}" and status = "${status}"`);
        return result;
    }

    static async GetAvtByUserId(userId = 0) {
        const result = await query(`SELECT image_public_path FROM Image WHERE user_id = ${userId} ORDER BY image_id LIMIT 1;`);
        return result;
    }

    static async DeleteImageByReportId(report_id = 0) {
        const result = await query(`DELETE FROM Image where report_id = ${report_id};`);
        return result;
    }

    static async DeleteImageByContributeId(contribute_id = 0) {
        const result = await query(`DELETE FROM Image where contribute_id = ${contribute_id};`);
        return result;
    }

    static async UpdateContributeImage(imageId, newPublicPath, newLocalPath, newStatus) {
        const strQuery = `UPDATE Image SET image_public_path = "${newPublicPath}"
                                        , image_local_path = "${newLocalPath}" 
                                        , status = "${newStatus}" 
                            WHERE image_id = ${imageId}`;

        const result = await query(strQuery);

        if(result.resultCode == ResultCode.Success)
        {
            return new Result(ResultCode.Success, "Cập nhật ảnh thành công!");
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }

    static async GetImageByContributeId(contribute_id) {
        const result = await query(`SELECT image_id, image_local_path, image_public_path, image_type, status FROM Image WHERE contribute_id = ${contribute_id}`);
        return result;
    }
}