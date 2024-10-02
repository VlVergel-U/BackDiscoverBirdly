import { Router } from 'express'

import { getDepartments } from '../controllers/department.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const departmentRouter = Router()


departmentRouter.get("/department", getDepartments);


export default departmentRouter;