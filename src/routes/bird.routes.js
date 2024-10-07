import { Router } from 'express'

import { createBirds } from '../controllers/bird.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const birdRouter = Router()

birdRouter.post("/bird", createBirds);

export default birdRouter;