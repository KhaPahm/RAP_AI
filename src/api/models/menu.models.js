import { query } from "./index.models.js"; 
import { Status } from "../interfaces/enum.interfaces.js";

export class Menu {
    constructor(menu_id = 0, menu_name = "", menu_path = "") {
        this.menuId = menu_id;
        this.menuName = menu_name;
        this.menuPath = menu_path;
    }
}

export class ls_Menu {
    constructor(menus = []) {
        this.lsMenu = menus;
    }

    static async GetMenusForUser(user_id = 0, statusOfUser = Status.OK, statusOfMenu = Status.OK) {
        console.log(statusOfUser);
        const strQuery = 
        `Select m.menu_id, m.menu_path, m.menu_name  from User u 
            left join User_Role ur on u.user_id = ur.user_id
            left join Role r on ur.role_id = r.role_id
            left join Menu_Role ml on r.role_id = ml.role_id
            left join Menu m on ml.menu_id = m.menu_id
        where u.user_id = "${user_id}" and u.status = "${statusOfUser}" and m.status = "${statusOfMenu}" `;

		const result = await query(strQuery);
		if(result.length != 0) {
            const listMenu = [];
            result.forEach(menu => {
                listMenu.push(new Menu(menu.menu_id, menu.menu_name, menu.menu_path));
            });
            return new ls_Menu(listMenu);
        }
        return null
    } 
}