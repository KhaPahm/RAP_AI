import { Router } from "express";
const router = Router();
import userRouter from "./user.routers.js";
import adminRouter from "./admin.routers.js"
import redlist from "./animal_red_list.router.js";
import image from "./image.routers.js";
import report from "./report.routers.js";
import history from "./history.router.js";
import contribute from "./contribute.routers.js"


router.use("/user", userRouter);

router.use("/admin", adminRouter);

router.use("/redList", redlist);

router.use("/image", image);

router.use("/report", report);

router.use("/history", history);

router.use("/contribute", contribute);

router.use("/", (req, res) => {
	res.send("This is API for RAP.");
});

export default router;
