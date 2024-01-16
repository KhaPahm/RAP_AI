import { Menu } from "../models/menu.models.js";

export async function AddNewMenu(menu = new Menu()) {
    const result = await menu.AddNewMenu();
    return result;
}

export async function GetMenus(menuId = 0, status = null) {
    const result = await Menu.GetMenus(menuId, status);
    return result;
}

export async function UpdateMenu(menu = new Menu()) {
    const result = await menu.UpdateMenu();
    return result;
}