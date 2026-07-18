import express from 'express';
import {
  validationMiddleware,
  authenticate,
} from '../middlewares/validation.middlewares.js';
import cropValidationSchema from '../validation/crop.validation.js';
import {
  postCrop,
  getCrop,
  updateCropStatus,
} from '../controllers/crop.controllers.js';

const router = express.Router();

router.post('/', authenticate, validationMiddleware(cropValidationSchema), postCrop);
router.get('/', authenticate, getCrop);
router.patch('/:id/status', authenticate, updateCropStatus);

export default router;