import express from 'express';

import usersController from '../controllers/users.controller';

const router = express.Router();

router.get('/users', usersController.index);

router.post('/create-user', usersController.create);

router.get('/users/:id', usersController.show);

export default router;
