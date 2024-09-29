import { Router } from 'express'

import { register, login } from '../controllers/user.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const userRouter = Router()


userRouter.get("/login", login);
userRouter.post("/register", register);


export default userRouter;