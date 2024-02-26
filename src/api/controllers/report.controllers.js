import { ActionReport, ResultCode, Status } from "../interfaces/enum.interfaces.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { Report } from "../models/report.models.js";
import { CreateNewReport, GetReportByReportID, RecordAction } from "../services/report.services.js";
import { ConverDateTimeToString } from "../helpers/string.helpers.js";
import { User_Report } from "../models/user_report.models.js";

export async function _CreateNewReport(req, res) {
    const title = req.body.title || "";
    const description = req.body.description || "";
    const reportTime = new Date();
    const status = Status.WT;
    const lat = req.body.lat || 0.0;
    const lng = req.body.lng || 0.0;
    const buffer = req.file.buffer || null;
    const userId  = req.user.userId;

    if(title == "" || description == "" || lat == 0.0 || lng == 0.0 || buffer == null) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    } else {
        const report = new Report(0, title, description, ConverDateTimeToString(reportTime), status, lat, lng);
        const result = await CreateNewReport(report, buffer, userId);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _GetReport(req, res) {
    let rptId = req.body.reportId || 0;
    let status = req.body.status || null;
    const result = await GetReportByReportID(rptId, status);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(1, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}


export async function _RecordAction(req, res) {
    const action = req.body.action || null;
    const handle_time = ConverDateTimeToString(new Date());
    const userId  = req.user.userId;
    const reportId = req.body.reportId || 0;

    if(reportId == 0 || action == null) 
    {
        return res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else if(action != ActionReport.Accept && action != ActionReport.Create && action != ActionReport.Denied && action != ActionReport.Success) 
    {
        return res.json(ApiRespone.Err(100, "Action chỉ chấp nhận Accept/Create/Denied/Success"));
    }

    const userReport = new User_Report(0, action, handle_time, userId, reportId);
    const result = await RecordAction(userReport);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(1, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}