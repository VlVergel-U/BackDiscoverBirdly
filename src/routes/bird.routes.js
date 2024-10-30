import { Router } from 'express'

import { getBirds, getBird, getUbicationBird, getBirdsByUbication } from '../controllers/bird.controller.js';
// import { validate } from '../middlewares/validator.middelware.js'
// import { createIceCreamValidator, deleteIceCreamValidator, getIceCreamValidator, updateIceCreamValidator } from '../validators/ice_cream.validators.js'

const birdRouter = Router()

birdRouter.get("/bird", getBirds);
birdRouter.get("/bird/:searchValue", getBird)
//ESTO ES TEMPORAL
birdRouter.get("/birdUbication", getUbicationBird)
birdRouter.get("/birdUbication/:ubication", getBirdsByUbication)


export default birdRouter;