import { Report } from "../models/report.models.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { ActionReport, FolderInCloudinary, ImageType, ResultCode } from "../interfaces/enum.interfaces.js";
import { DeleteImage, UploadImage } from "./cloudinary.services.js";
import ImageModel from "../models/image.models.js";
import { WriteErrLog } from "../helpers/index.helpers.js";
import { Status } from "../interfaces/enum.interfaces.js";
import { User_Report } from "../models/user_report.models.js";

export async function CreateNewReport(report = new Report(), buffer, userId = 0) {
    const resultCreateReport = await report.CreateNewReport();
    if(resultCreateReport.resultCode != ResultCode.Success) {
        return resultCreateReport
    }

    const reportId = report.report_id;

    let isErro = false;
    let fileName = "";
    const promiseUpload = UploadImage(FolderInCloudinary.ReportImages, buffer);
        await promiseUpload
            .then(async (value) => {
                fileName = value.public_id;
                var path = value.url;
                const newImage = new ImageModel(0, path, path, report.title, ImageType.Report, Status.OK, null, null, reportId);
                const resultAddImage = await newImage.AddNewImage();
                if(resultAddImage.resultCode != ResultCode.Success) {
                    isErro = true;
                }
            })
            .catch((err) => {
                isErro = true;
                WriteErrLog(err);
            });

    if(isErro){
        report.DeleteReport();
        return new Result(ResultCode.Err, "Lỗi trá trình cập nhật ảnh!")
    }

    const imagesResult = await ImageModel.GetImageByReportId(reportId);
    report.image = imagesResult.data[0].image_public_path;

    const userReport = new User_Report(0, ActionReport.Create, report.report_time, userId, reportId);
    const userReportResult = await userReport.AddUserReport();
    if(userReportResult.resultCode != ResultCode.Success) {
        await ImageModel.DeleteImageByReportId(reportId);
        await report.DeleteReport();
        const promiseDelete = DeleteImage(FolderInCloudinary.ReportImages, fileName);
        await promiseDelete
            .catch((err) => {
                WriteErrLog(err);
            });

        return new Result(ResultCode.Err, "Lỗi quá trình tạo báo cáo!"); 
    }

    return new Result(ResultCode.Success, "Success", report);
}   

export async function GetReportByReportID(report_id = 0, status) {
    let result = Report.GetReportByReportID(report_id, status);
    return result;
}

export async function RecordAction(userReport = new User_Report()) {
    const result = await userReport.AddRecordActionReport();
    if(result.resultCode == ResultCode.Success) {
        if(userReport.action == ActionReport.Accept || userReport.action == ActionReport.Success) {
            const resultUpdateReportStatus = await Report.UpdateReportStatus(userReport.report_id, "OK");
            if(resultUpdateReportStatus.resultCode != ResultCode.Success) {
                await userReport.DeleteRecordActionReport();
                return new Result(ResultCode.Err, "Error when record new action!", null);
            }
        }
        else if(userReport.action == ActionReport.Denied) {
            const resultUpdateReportStatusXX = await Report.UpdateReportStatus(userReport.report_id, "XX");
            if(resultUpdateReportStatusXX.resultCode != ResultCode.Success) {
                await userReport.DeleteRecordActionReport();
                return new Result(ResultCode.Err, "Error when record new action!", null);
            }
        }
    }
    return result;
}
