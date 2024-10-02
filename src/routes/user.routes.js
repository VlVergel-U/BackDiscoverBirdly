import { Router } from 'express'

import { createUser, updateUser, deleteUser, getAllUsers, getUser } from '../controllers/user.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const userRouter = Router()


userRouter.post("/user", createUser);
userRouter.get("/user/:username", getUser);
userRouter.get("/user", getAllUsers);
userRouter.put("/user/:username", updateUser);
userRouter.delete("/user/:username", deleteUser);


export default userRouter;