import { query } from "./index.models.js"; 
import { Status } from "../interfaces/enum.interfaces.js";

export class Role {
    constructor(role_id = 0, role_name = "", role_description = "") {
        this.role_id = role_id;
        this.role_name = role_name;
        this.role_description = role_description;
    }

    static async GetMenuOfUser(user_id = 0, statusOfUser = Status.OK, statusOfMenu = Status.OK) {
        const strQuery = 
        `Select m.menu_id, m.menu_path, m.menu_name  from User u 
            left join User_Role ur on u.user_id = ur.user_id
            left join Role r on ur.role_id = r.role_id
            left join Menu_Role ml on r.role_id = ml.role_id
            left join Menu m on ml.menu_id = m.menu_id
        where u.user_id = "${user_id}" and u.status = "${statusOfUser}" and m.status = "${statusOfMenu}" `;

		const result = await query(strQuery);
		if(result.length != 0) {
            return new Role(result[0].role_id, result[0].role_name, result[0].role_description)
        }
        return null;
    }
}