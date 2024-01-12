import ApiRespone from "../interfaces/api.respone.interfaces.js";

export async function CheckUrlRole(req, res, next) {
    const user = req.user;
    const originalUrl = req.originalUrl;

    const lsMenu = user.role.lsMenu;
    lsMenu.forEach(menu => {
        if(menu.menuPath == originalUrl) {
            next();
        }
    });
    res.json(ApiRespone.Err(100, "Bạn không có quyền truy cập"));
}