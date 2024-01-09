import { Router } from "express";
import { LogIn, SetPassword } from "../controllers/user.controllers.js";
import Multer from "multer";

const upload = Multer();
const router = Router();

router.post("/login", upload.any(), LogIn);
router.post("/resetPassword", upload.any(), SetPassword);

export default router;