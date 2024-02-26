import { Status } from "../interfaces/enum.interfaces.js";
import { ConverDateTimeToString } from "../helpers/string.helpers.js";
import { query } from "./index.models.js"; 
import { ResultCode } from "../interfaces/enum.interfaces.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import ImageModel from "./image.models.js";
import { data } from "@tensorflow/tfjs-node";

export class Report {
    constructor(report_id = 0, title = "", description = "", report_time = "", status = Status.WT, lat = 0.0, lng = 0.0) {
        this.report_id = report_id;
        this.title = title;
        this.description = description;
        this.report_time = report_time;
        this.status = status;
        this.lat = lat;
        this.lng = lng;
        this.image = "";
    }

    //Hàm dùng để xóa report khỏi db nếu up load ảnh bị lỗi
    async DeleteReport() {
        const strQuery = `DELETE FROM Report WHERE report_id = ${this.report_id}`;

        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.report_id = result.data.insertId;
            return new Result(ResultCode.Success, "Xóa báo cáo thành công!", this);
        }

        return new Result(ResultCode.Err, "Erro when delete report!", null);
    }

    async CreateNewReport() {
        const strQuery = `INSERT INTO Report (
                            title,
                            description,
                            report_time,
                            status,
                            lat,
                            lng
                        ) VALUES (
                            "${this.title}",
                            "${this.description}",
                            "${this.report_time}",
                            "${this.status}",
                            ${this.lat},
                            ${this.lng}
                        )`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.report_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm báo cáo thành công!", this);
        }

        return new Result(ResultCode.Err, "Erro when create new report!", null);
    }

    static async GetReportByReportID(report_id = 0, status) {
        var strQuery = "";
        if(report_id == 0 && (status == Status.OK || status == Status.WT || status == Status.XX)) {
            strQuery = `SELECT rpt.report_id, rpt.title, rpt.description, rpt.report_time, rpt.status, rpt.lat, rpt.lng, img.image_public_path as image 
                                FROM Report as rpt 
                                JOIN Image as img
                                ON rpt.report_id = img.report_id 
                                WHERE rpt.status = "${status}"`;
        }
        else if(report_id == 0 && (status != Status.OK && status != Status.WT && status != Status.XX)) {
            strQuery = `SELECT rpt.report_id, rpt.title, rpt.description, rpt.report_time, rpt.status, rpt.lat, rpt.lng, img.image_public_path as image 
                                FROM Report as rpt 
                                JOIN Image as img
                                ON rpt.report_id = img.report_id`
                                ;
        }
        else if(report_id != 0 && (status == Status.OK || status == Status.WT || status == Status.XX)) {
            strQuery = `SELECT rpt.report_id, rpt.title, rpt.description, rpt.report_time, rpt.status, rpt.lat, rpt.lng, img.image_public_path as image 
                                FROM Report as rpt 
                                JOIN Image as img
                                ON rpt.report_id = img.report_id 
                                WHERE rpt.report_id = ${report_id} AND rpt.status = "${status}"`;
        }
        else {
            strQuery = `SELECT rpt.report_id, rpt.title, rpt.description, rpt.report_time, rpt.status, rpt.lat, rpt.lng, img.image_public_path as image 
                                FROM Report as rpt 
                                JOIN Image as img
                                ON rpt.report_id = img.report_id 
                                WHERE rpt.report_id = ${report_id}`;
        }

        const result = await query(strQuery);
        if(result.resultCode != ResultCode.Success) {
            return result;
        }

        
        return result;
    }

    static async UpdateReportStatus(report_id = 0, status = Status.OK) {
        const strQuery = `UPDATE Report SET status = "${status}" 
                                          WHERE report_id = ${report_id}`;

                                          const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.role_id = result.data.insertId;
            return new Result(ResultCode.Success, "Success!", this);
        }

        return new Result(ResultCode.Err, "Erro when update report's status!", null);
    }
    
}