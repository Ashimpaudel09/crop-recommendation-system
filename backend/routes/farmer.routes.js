import express from 'express';
import {
  validationMiddleware,
  authenticate
} from '../middlewares/validation.middlewares.js';

import {
  farmerValidationSchema
} from '../validation/farmer.validation.js';

import {
  postfarmer,
  getfarmer
} from '../controllers/farmer.controllers.js';

const router = express.Router();

router.post("/farmer",authenticate,validationMiddleware(farmerValidationSchema),postfarmer);
router.get("/farmer",authenticate,getfarmer);


export default router;