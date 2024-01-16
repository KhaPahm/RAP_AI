import { Menu_Role } from "../models/menu_role.models.js";

export async function AddMenuToRole(menu_role = new Menu_Role()) {
    const result = await menu_role.AddMenuToRole();
    return result;
}