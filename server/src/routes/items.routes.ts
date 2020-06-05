import express from 'express';

import itemsController from '../controllers/items.controller';

const router = express.Router();

router.get('/items', itemsController.index);

export default router;
