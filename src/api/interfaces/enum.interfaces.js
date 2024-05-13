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
    ModelsImages: "RAP/ModelsImages", //Dùng để train lại models
    RedListImages: "RAP/RedListImages", //Để chứ các ảnh đại diện của các động vật trong sách đỏ
    UserImageRedict: "RAP/UserImageRedict", //Dùng để chứ các ảnh của người dùng dùng để dự đoán
    UserPersionalImage: "RAP/UserPersionalImage", //Dùng để chứa ảnh cá nhân của người dùng
    ReportImages: "RAP/ReportImages", //Dùng để chứ ảnh report
    ContributeImages: "RAP/Contribute" //Dùng để chứ ảnh góp ý
})

//AVT - ảnh đại diện
//RPT - ảnh report
//AIC - ảnh dự đoán
//SYS - ảnh hệ thống
export const ImageType = Object.freeze({
    Avata: "AVT",
    Report: "RPT",
    Redict: "AIC",
    System: "SYS",
    Contribute: "CON"
});

export const ActionReport = Object.freeze({
    Create: "CREATE",
    Accept: "ACCEPT",
    Denied: "DENIED",
    Success: "SUCCESS"
});

export const AnimalSearchTypes = Object.freeze({
    Search: "SER",
    Predict: "AIC"
})