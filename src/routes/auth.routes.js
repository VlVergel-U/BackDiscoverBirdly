import { Router } from 'express'

import { login } from '../controllers/auth.controller.js';
import { createUser } from '../controllers/user.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const authRouter = Router()


authRouter.post("/login", login);
authRouter.post("/register", createUser);


export default authRouter;