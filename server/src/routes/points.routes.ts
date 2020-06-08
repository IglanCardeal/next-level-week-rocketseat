import express from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import pointsController from '../controllers/points.controller';

import multerConfig from '../config/multer';

const router = express.Router();
const upload = multer({
  fileFilter: multerConfig.fileFiler,
  storage: multerConfig.storage,
});

router.get('/points', pointsController.index);

router.post(
  '/create-point',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().required(),
        whatsapp: Joi.number().required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  pointsController.create,
);

router.get('/points/:id', pointsController.show);

export default router;
