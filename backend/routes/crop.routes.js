import express from 'express';
import {
  validationMiddleware,
  authenticate
} from '../middlewares/validation.middlewares.js';

import {
  cropValidationSchema
} from '../validation/crop.validation.js';

import {
  postCrop,
  getCrop
} from '../controllers/crop.controllers.js';

const router = express.Router();

router.post("/crop",authenticate,validationMiddleware(cropValidationSchema),postCrop);
router.get("/crop",authenticate,getCrop);


export default router;