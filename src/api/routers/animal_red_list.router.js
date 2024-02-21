import { Router } from "express";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { _GetAnimalRedList, _PredictAnimal } from "../controllers/animal_red_list.controller.js";

const upload = Multer();
const router = Router();

router.post("/getAnimalRedList", upload.any(), TokenValidator, CheckUrlRole, _GetAnimalRedList);
router.post("/predictAnimal", upload.single("image"), TokenValidator, _PredictAnimal);

export default router;