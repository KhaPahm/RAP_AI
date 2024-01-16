import { ResultCode } from "../interfaces/enum.interfaces.js";
import { AddNewMenu, GetMenus, UpdateMenu } from "../services/menu.services.js";
import { AddNewRole, GetRoles, UpdateRole } from "../services/role.services.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { AddMenuToRole } from "../services/menu_role.services.js";
import { Role } from "../models/role.models.js";
import { Menu_Role } from "../models/menu_role.models.js";
import { Menu } from "../models/menu.models.js";

export async function _AddNewMenu(req, res) {
    const menuName = req.body.menuName || "";
	const menuPath = req.body.menuPath || "";

    if(menuName == "" || menuPath == "") {
        res.json(ApiRespone.Err(100, "Dữ liệu bị trống!"));

    }
    else {
        const newMenu = new Menu(0, menuName, menuPath);
        const result = await AddNewMenu(newMenu);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _AddMenuToRole(req, res) {
    const menuId = Number(req.body.menuId) || 0;
    const roleId = Number(req.body.roleId) || 0;

    if(menuId == 0 || roleId == 0) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const newMenu_Role = new Menu_Role(menuId, roleId);
        const result = await AddMenuToRole(newMenu_Role);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _AddNewRole(req, res) {
    const roleName = req.body.roleName || "";
    const roleDescription = req.body.roleDescription || "";

    if(roleName == "") {
        res.json(ApiRespone.Err(100, "Không được để trống tên quyền!"));
    }
    else {
        const newRole = new Role(0, roleName, roleDescription);
        const result = await AddNewRole(newRole);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
} 

export async function _GetMenus(req, res) {
    const menuId = Number(req.body.menuId) || 0;
    const status = req.body.status || null;
    

    const result = await GetMenus(menuId, status);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(result.data.length, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}

export async function _GetRoles(req, res) {
    const roleId = Number(req.body.roleId) || 0;

    const result = await GetRoles(roleId);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(result.data.length, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}

export async function _UpdateRole(req, res) {
    const roleId = Number(req.body.roleId) || 0;
    const roleName = req.body.roleName || "";
    const roleDescription = req.body.roleDescription || "";
    const status = req.body.status || "OK";

    if(roleId == 0 || roleName == "") {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const role = new Role(roleId, roleName, roleDescription, status);
        const result = await UpdateRole(role);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(result.data.length, null));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _UpdateMenu(req, res) {
    const menuId = req.body.menuId || 0;
    const menuName = req.body.menuName || "";
	const menuPath = req.body.menuPath || "";
    const status = req.body.status || "OK";
    if(menuName == "" || menuPath == "" || menuId == 0) {
        res.json(ApiRespone.Err(100, "Dữ liệu bị trống!"));
    }
    else {
        const menu = new Menu(menuId, menuName, menuPath, null, status);
        const result = await UpdateMenu(menu);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(result.data.length, null));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}