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