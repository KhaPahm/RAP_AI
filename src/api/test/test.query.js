import { query } from "../models/index.models.js";
import { Menu } from "../models/menu.models.js";
import { Role } from "../models/role.models.js";
import { Menu_Role } from "../models/menu_role.models.js";
import ImageModel from "../models/image.models.js";
import path from "path";
import { log } from "console";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from "path";
import { SendingMail } from "../services/mail.services.js";

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
    
    // var link = "http://res.cloudinary.com/dpsux2vzu/image/upload/v1705944768/RAP/RedListImages/sju4vfv6sjk8ujhk7cpv.jpg";
    // var t = path.basename(link, ".jpg");
    // console.log(t);
    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = dirname(__filename);
    
    // // fs.readFile(__dirname + "/../../static/static_mail_format.html",function(err, data) {
        
    // //     var mailTemplateContent = data.toString();
    // //     mailTemplateContent = mailTemplateContent.replace("[0000]", "1234");
    // //     console.log(mailTemplateContent);
        
    // //     return;
    // // });

    // var template = await fs.readFileSync(__dirname + "/../../static/static_mail_format_NewAccount.html", "utf8");
    // template = template.replace("[username]", "khaph");
    // template = template.replace("[password]", "123456789");
    // template = template.replace("[fullName]", "Kha");

    // const resultEmailSending = await SendingMail("khapham1909@gmail.com", "Account information", template);
	// 	//Nếu gửi mail thành công
}

test();

