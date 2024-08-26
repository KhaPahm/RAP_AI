import ApiRespone from "../interfaces/api.respone.interfaces.js";

export async function CheckUrlRole(req, res, next) {
    const user = req.user;
    const originalUrl = req.originalUrl;
    const lsMenu = user.role.data;
    if(lsMenu.includes(originalUrl))
        next();
    else 
        res.json(ApiRespone.Err(100, "Bạn không có quyền truy cập chức năng này!"));
}

export async function CheckOTP(req, res, next) {
    const user = req.user;
    const inputOtp = req.otp;
    const accessTokenOTP = user.otp;
    if(inputOtp === accessTokenOTP)
        next();
    else 
        res.json(ApiRespone.Err(100, "OTP không đúng"));
}