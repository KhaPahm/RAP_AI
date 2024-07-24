import { query } from "../models/index.models.js";
import { Menu } from "../models/menu.models.js";
import { Role } from "../models/role.models.js";
import { Menu_Role } from "../models/menu_role.models.js";
import ImageModel from "../models/image.models.js";
import path from "path";
import { log } from "console";

async function test() {
    //await query("Select * from Menu");
    // const resultc = await query(`INSERT INTO Menu(menu_name, menu_path, pid, status) VALUES ("Add role", "/admin/addMenu", null, "OK");`);
    // console.log(resultc);
    //const result = await Menu_Role.AddMenuRole(100, 1);
    // const role = new Role(0, "admin", "kha test");
    // const result = await role.AddNewRole();
    // console.log(result);
    // const result = await ImageModel.GetImageByAnimalRedList(4);
    // console.log(result);
    // return;
    
    var link = "http://res.cloudinary.com/dpsux2vzu/image/upload/v1705944768/RAP/RedListImages/sju4vfv6sjk8ujhk7cpv.jpg";
    var t = path.basename(link, ".jpg");
    console.log(t);
}

test();

