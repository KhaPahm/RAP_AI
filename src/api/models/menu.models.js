import { query } from "./index.models.js"; 
import { ResultCode, Status } from "../interfaces/enum.interfaces.js";
import { Result } from "../interfaces/api.respone.interfaces.js";
import { SourceCode } from "eslint";

export class Menu {
    constructor(menu_id =  0, menu_name = "", menu_path = "", pid = 0, status = Status.OK) {
        this.menu_id = menu_id;
        this.menu_name = menu_name;
        this.menu_path = menu_path;
        this.pid = pid;
        this.status = status;
    }

    get GetMenuPath() {
        return this.menu_path;
    }

    async AddNewMenu() {
        //Insert và lấy id mới nhất;
        const strQuery = `INSERT INTO Menu(menu_name, menu_path, pid, status) VALUES ("${this.menu_name}", "${this.menu_path}", ${this.pid}, "${this.status}");`
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success) {
            this.menu_id = result.data.insertId;
            return new Result(ResultCode.Success, "Thêm menu mới, thành công!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Menu đã tồn tại! Vui lòng nhập path khác!", null);
        }

        return new Result(ResultCode.Err, "Erro when add new Menu!", null);
    }

    static async GetListMenuPath(user_id = 0, statusOfUser = Status.OK, statusOfMenu = Status.OK, statusOfRole = Status.OK) {
        const strQuery = 
        `Select m.menu_path from User u 
            left join User_Role ur on u.user_id = ur.user_id
            left join Role r on ur.role_id = r.role_id
            left join Menu_Role ml on r.role_id = ml.role_id
            left join Menu m on ml.menu_id = m.menu_id
        where u.user_id = "${user_id}" and u.status = "${statusOfUser}" and m.status = "${statusOfMenu}" and r.status = "${statusOfRole}" `;

		const result = await query(strQuery);
		if(result.resultCode == ResultCode.Success) {
            const listMenu = [];
            result.data.forEach(menu => {
                listMenu.push(menu.menu_path);
            });
            return new Result(ResultCode.Success, "Success", listMenu);
        }
        return result;
    } 

    static async GetMenus(menuId = 0, statusOfMenu = null) {
        var strQuery = "";
        if(menuId == 0 && statusOfMenu == null)
            strQuery = "SELECT * FROM Menu;";
        else if (menuId != 0 && statusOfMenu != null){
            strQuery = `SELECT * FROM Menu WHERE menu_id = ${menuId} AND status = "${statusOfMenu}"`;
        }
        else if(menuId == 0) {
            strQuery = `SELECT * FROM Menu where status = "${statusOfMenu}"`;
        }
        else if(statusOfMenu == null) {
            strQuery = `SELECT * FROM Menu where menu_id = ${menuId}`;
        } 
        
		const result = await query(strQuery);
        
        return result;
    }

    async UpdateMenu() {
        const strQuery = `UPDATE Menu SET menu_name = "${this.menu_name}", 
                                          menu_path = "${this.menu_path}", 
                                          pid = "${this.pid}", 
                                          status = "${this.status}" 
                                          WHERE menu_id = ${this.menu_id}`;
        const result = await query(strQuery);
        if(result.resultCode == ResultCode.Success)
        {
            this.role_id = result.data.insertId;
            return new Result(ResultCode.Success, "Success!", this);
        }
        if(result.resultCode == ResultCode.Warning && result.data.code == "ER_DUP_ENTRY") {
            return new Result(ResultCode.Err, "Menu cập nhật bị trùng, vui lòng thử lại!", null);
        }

        return new Result(ResultCode.Err, "Erro when add new role!", null);
    }
}
