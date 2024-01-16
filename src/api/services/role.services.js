import { Status } from "../interfaces/enum.interfaces.js";
import { Role } from "../models/role.models.js";

export async function GetRoles(roleId = 0) {
    const result = await Role.GetRoles(roleId);
    return result;
}

export async function AddNewRole(role = new Role()) {
    const result = await role.AddNewRole();
    return result;
}

export async function UpdateRole(role = new Role()) {
    const result = await role.UpdateRole();
    return result;
}