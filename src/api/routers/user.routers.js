import { Router } from "express";
import { _LogIn, _SetPassword, _Register, _VerifyOtp } from "../controllers/user.controllers.js";
import Multer from "multer";

const upload = Multer();
const router = Router();

router.post("/login", upload.any(), _LogIn);
router.post("/resetPassword", upload.any(), _SetPassword);
router.post("/register", upload.any(), _Register);
router.post("/verifyOtp", upload.any(), _VerifyOtp);

//router.get("/test", upload.any(), TestMail);

export default router;