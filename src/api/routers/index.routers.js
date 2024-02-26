import { Router } from "express";
const router = Router();
import userRouter from "./user.routers.js";
import adminRouter from "./admin.routers.js"
import redlist from "./animal_red_list.router.js";
import image from "./image.routers.js";
import report from "./report.routers.js";

router.use("/user", userRouter);

router.use("/admin", adminRouter);

router.use("/redList", redlist);

router.use("/image", image);

router.use("/report", report);

router.use("/", (req, res) => {
	res.send("This is API for RAP.");
});

export default router;
