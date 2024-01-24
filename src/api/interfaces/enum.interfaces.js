export const Status = Object.freeze({
    OK: "OK", //Trạng thái hoạt động bình thường
    XX: "XX", //Trạng thái đánh dấu bị xóa
    WT: "WT" //Trạng thái đang chờ
})

export const ResultCode = Object.freeze({
    Success: "Success",
    Err: "Error",
    Warning: "Warning"
})

export const FolderInCloudinary = Object.freeze({
    ModelsImages: "RAP/ModelsImages",
    RedListImages: "RAP/RedListImages",
    UserImageRedict: "RAP/UserImageRedict",
    UserPersionalImage: "RAP/UserPersionalImage",
})

//AVT - ảnh đại diện
//RPT - ảnh report
//AIC - ảnh dự đoán
//SYS - ảnh hệ thống
export const ImageType = Object.freeze({
    Avata: "AVT",
    Report: "RPT",
    Redict: "AIC",
    System: "SYS"
})