import { Router } from "express";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { _GetAnimalRedList, _PredictAnimal, _SearchAnimalRedList } from "../controllers/animal_red_list.controller.js";

const upload = Multer();
const router = Router();

router.post("/searchAnimalReadList", upload.any(), _SearchAnimalRedList);
router.post("/getAnimalRedList", upload.any(), _GetAnimalRedList);
router.post("/getAnimalRedListAfterLogin", upload.any(), TokenValidator, _GetAnimalRedList);
router.post("/predictAnimal", upload.single("image"), _PredictAnimal);
router.post("/predictAnimalAfterLogin", upload.single("image"), TokenValidator, _PredictAnimal);

export default router;