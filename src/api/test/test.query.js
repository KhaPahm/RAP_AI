import { query } from "../models/index.models.js";
import { Menu } from "../models/menu.models.js";
import { Role } from "../models/role.models.js";
import { Menu_Role } from "../models/menu_role.models.js";

async function test() {
    //await query("Select * from Menu");
    // const resultc = await query(`INSERT INTO Menu(menu_name, menu_path, pid, status) VALUES ("Add role", "/admin/addMenu", null, "OK");`);
    // console.log(resultc);
    //const result = await Menu_Role.AddMenuRole(100, 1);
    // const role = new Role(0, "admin", "kha test");
    // const result = await role.AddNewRole();
    // console.log(result);
    const result = await Role.DeleteRole(13);
    console.log(result);
    return;
}

test();

