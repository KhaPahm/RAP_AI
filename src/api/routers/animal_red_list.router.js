import { Router } from "express";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { _GetAnimalRedList } from "../controllers/animal_red_list.controller.js";

const upload = Multer();
const router = Router();

router.post("/getAnimalRedList", upload.any(), TokenValidator, CheckUrlRole, _GetAnimalRedList);

export default router;