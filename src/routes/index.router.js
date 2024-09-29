import { Router } from "express";
import userRouter from "./user.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", userRouter);

export default indexRouter;