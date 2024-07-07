import { Router } from "express";
import Multer from "multer";
import { TokenValidator } from "../middlewares/verify.token.middleware.js";
import { CheckUrlRole } from "../middlewares/role.check.middleware.js";
import { _AddNewContribute, _GetContributeById, _UpdateContribute } from "../controllers/contribute.controllers.js";

const upload = Multer();
const router = Router();

router.post("/createContribute", upload.array("images"), TokenValidator, CheckUrlRole, _AddNewContribute)
router.post("/getContributeById", upload.any(), TokenValidator, CheckUrlRole, _GetContributeById)
router.post("/updateContributeById", upload.any(), TokenValidator, CheckUrlRole, _UpdateContribute)

export default router;
