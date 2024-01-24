import { ResultCode } from "../interfaces/enum.interfaces.js";
import { AddNewMenu, GetMenus, UpdateMenu } from "../services/menu.services.js";
import { AddNewRole, GetRoles, UpdateRole } from "../services/role.services.js";
import ApiRespone from "../interfaces/api.respone.interfaces.js";
import { AddMenuToRole } from "../services/menu_role.services.js";
import { Role } from "../models/role.models.js";
import { Menu_Role } from "../models/menu_role.models.js";
import { Menu } from "../models/menu.models.js";
import { Conservation_Status } from "../models/conservation_status.models.js";
import { AddConservationStatus, GetConservationStatus, UpdateConservationStatus } from "../services/conservation_status.services.js";
import { Animal_Type } from "../models/animal_types.models.js";
import { AddAnimalType, GetAnimalTypes, UpdateAnimalType } from "../services/animal_types.services.js";
import { Animal_Red_List } from "../models/animal_red_list.models.js";
import { AddAnimalRedList } from "../services/animal_red_list.models.js";

//#region Handle menu
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
//#endregion

//#region Handle role
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

export async function _GetRoles(req, res) {
    const roleId = Number(req.body.roleId) || 0;
    const status = req.body.status || "OK";

    const result = await GetRoles(roleId, status);
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
//#endregion

//#region Handle conservation status
export async function _AddConservationStatus(req, res) {
    const statusName = req.body.statusName || "";
    const standName = req.body.standName || "";
    const description = req.body.description || "";
    const status = req.body.status || "OK";

    if(standName == "" || statusName == "") {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const cs = new Conservation_Status(0, statusName, standName, description, status);
        const result = await AddConservationStatus(cs);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _GetConservationStatus(req, res) {
    const conservationStatusId = Number(req.body.conservationStatusId) || 0;
    const status = req.body.status || "OK";

    const result = await GetConservationStatus(conservationStatusId, status);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(result.data.length, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}

export async function _UpdateConservationStatus(req, res) {
    const conservationStatusId = Number(req.body.conservationStatusId) || 0;
    const statusName = req.body.statusName || "";
    const standName = req.body.standName || "";
    const description = req.body.description || "";
    const status = req.body.status || "OK";

    if(standName == "" || statusName == "" || conservationStatusId == 0) {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const cs = new Conservation_Status(conservationStatusId, statusName, standName, description, status);
        const result = await UpdateConservationStatus(cs);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}
//#endregion

//#region Handle animal type
export async function _AddAnimalType(req, res) {
    const typeName = req.body.typeName || "";
    const description = req.body.description || "";
    const status = req.body.status || "OK";

    if(typeName == "") {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const animalType = new Animal_Type(0, typeName, description, status);
        const result = await AddAnimalType(animalType);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}

export async function _GetAnimalType(req, res) {
    const animalTypeId = Number(req.body.animalTypeId) || 0;
    const status = req.body.status || "OK";

    const result = await GetAnimalTypes(animalTypeId, status);
    if(result.resultCode == ResultCode.Success) {
        res.json(ApiRespone.Success(result.data.length, result.data));
    }
    else {
        res.json(ApiRespone.Err(100, result.message));
    }
}

export async function _UpdateAnimalType(req, res) {
    const animalTypeId = Number(req.body.animalTypeId) || 0;
    const typeName = req.body.typeName || "";
    const description = req.body.description || "";
    const status = req.body.status || "OK";

    if(animalTypeId == 0 || typeName == "") {
        res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
    }
    else {
        const animalType = new Animal_Type(animalTypeId, typeName, description, status);
        const result = await UpdateAnimalType(animalType);
        if(result.resultCode == ResultCode.Success) {
            res.json(ApiRespone.Success(1, result.data));
        }
        else {
            res.json(ApiRespone.Err(100, result.message));
        }
    }
}
//#endregion

// //#region Handle animal redlist 
// export async function _AddAnimalRedList(req, res) {
//     const VNName = req.body.VNName;
//     const ENName = req.body.ENName;
//     const SCName = req.body.SCName;
//     const animalInfor = req.body.animalInfor;
//     const predictID = req.body.predictID;
//     const status = req.body.status || "OK";
//     const animalTypeId = Number(req.body.animalTypeId) || 0;
//     const conservationStatusID = Number(req.body.conservationStatusID) || 0;
//     const buffers = req.files;

//     if(animalTypeId == 0 || conservationStatusID == 0 || !VNName || !ENName || !SCName || !animalInfor || !predictID) {
//         res.json(ApiRespone.Err(100, "Dữ liệu trống!"));
//     }
//     else {
//         const animalRedList = new Animal_Red_List(0, VNName, ENName, SCName, animalInfor, predictID, status, animalTypeId, conservationStatusID);
//         const result = await AddAnimalRedList(animalRedList, buffers);
//         if(result.resultCode == ResultCode.Success) {
//             res.json(ApiRespone.Success(1, result.data));
//         }
//         else {
//             res.json(ApiRespone.Err(100, result.message));
//         }
//     }
// }
// //#endregion

//#region Handle image 

//#endregion
