import { Router } from 'express'

import { getBirds, getBird } from '../controllers/bird.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const birdRouter = Router()

birdRouter.get("/bird", getBirds);
birdRouter.get("/bird/:searchValue", getBird)

export default birdRouter;