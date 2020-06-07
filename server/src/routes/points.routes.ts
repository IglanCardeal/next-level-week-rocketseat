import express from 'express';
import multer from 'multer';

import pointsController from '../controllers/points.controller';

import multerConfig from '../config/multer';

const router = express.Router();
const upload = multer({
  fileFilter: multerConfig.fileFiler,
  storage: multerConfig.storage,
});

router.get('/points', pointsController.index);

router.post('/create-point', upload.single('image'), pointsController.create);

router.get('/points/:id', pointsController.show);

export default router;
