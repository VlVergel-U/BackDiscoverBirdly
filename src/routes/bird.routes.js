import { Router } from 'express'

import { createBirds, getBirds } from '../controllers/bird.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const birdRouter = Router()

birdRouter.post("/bird", createBirds);
birdRouter.get("/bird", getBirds);

export default birdRouter;