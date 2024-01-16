import { Status } from "../interfaces/enum.interfaces.js";
import { query } from "./index.models.js"; 

export class Menu_Role {

    constructor(menu_id = 0, role_id = 0) {
        this.menu_id = menu_id;
        this.role_id = role_id;
    }

    async AddMenuToRole() {
        const strQuery = `insert into Menu_Role (menu_id, role_id) values (${this.menu_id}, ${this.role_id});`;
        const result = await query(strQuery);
        if(result.code == "ER_NO_REFERENCED_ROW_2") {
            result.message = "Menu hoặc quyền không phù hợp!"
        }
        return result;
    }

}