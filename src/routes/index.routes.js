import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/api", userRouter);

export default indexRouter;