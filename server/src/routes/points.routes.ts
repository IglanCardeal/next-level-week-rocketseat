import express from 'express';

import pointsController from '../controllers/points.controller';

const router = express.Router();

router.get('/points', pointsController.index);

router.post('/create-point', pointsController.create);

router.get('/points/:id', pointsController.show);

export default router;
