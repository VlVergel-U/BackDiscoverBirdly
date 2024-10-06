import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import departmentRouter from "./department.routes.js";
import birdRouter from "./bird.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/api", [userRouter, birdRouter]);
indexRouter.use("/info", departmentRouter);

export default indexRouter;