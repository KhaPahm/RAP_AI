import { Router } from "express";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { _AddAnimalType, _AddConservationStatus, _AddMenuToRole, _AddNewMenu, _AddNewRole, _CreateOfficerAccount, _GetAnimalType, _GetConservationStatus, _GetMenus, _GetRoles, _GetUsersList, _UpdateAnimalType, _UpdateConservationStatus, _UpdateMenu, _UpdateRole, _UpdateUser } from "../controllers/admin.controllers.js";
import { _AddAnimalRedList, _UpdateAnimalRedList } from "../controllers/animal_red_list.controller.js";

const upload = Multer();
const router = Router();

router.post("/addMenu", upload.any(), TokenValidator, CheckUrlRole, _AddNewMenu);
router.post("/addMenuToRole", upload.any(), TokenValidator, CheckUrlRole, _AddMenuToRole);
router.post("/getMenus", upload.any(), TokenValidator, CheckUrlRole, _GetMenus);
router.post("/updateMenu", upload.any(), TokenValidator, CheckUrlRole, _UpdateMenu);

router.post("/addRole", upload.any(), TokenValidator, CheckUrlRole, _AddNewRole);
router.post("/getRoles", upload.any(), TokenValidator, CheckUrlRole, _GetRoles);
router.post("/updateRole", upload.any(), TokenValidator, CheckUrlRole, _UpdateRole);

router.post("/addConservationStatus", upload.any(), TokenValidator, CheckUrlRole, _AddConservationStatus);
router.post("/getConservationStatus", upload.any(), TokenValidator, CheckUrlRole, _GetConservationStatus);
router.post("/updateConservationStatus", upload.any(), TokenValidator, CheckUrlRole, _UpdateConservationStatus);

router.post("/addAnimalType", upload.any(), TokenValidator, CheckUrlRole, _AddAnimalType);
router.post("/getAnimalType", upload.any(), TokenValidator, CheckUrlRole, _GetAnimalType);
router.post("/updateAnimalType", upload.any(), TokenValidator, CheckUrlRole, _UpdateAnimalType);

router.post("/addAnimalRedList", upload.array("images"), TokenValidator, CheckUrlRole, _AddAnimalRedList);
router.post("/updateAnimalRedList", upload.array("images"), TokenValidator, CheckUrlRole, _UpdateAnimalRedList);

router.post("/getUsersList", upload.any(), TokenValidator, CheckUrlRole, _GetUsersList);
router.post("/updateUserStatus", upload.any(), TokenValidator, CheckUrlRole, _UpdateUser);
router.post("/createOfficerAccount", upload.any(), TokenValidator, CheckUrlRole, _CreateOfficerAccount);


export default router;