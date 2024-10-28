import { Router } from 'express'

import { getHostpots } from '../controllers/hostpot.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const hostpotRouter = Router()

hostpotRouter.get("/hostpot", getHostpots);

export default hostpotRouter;