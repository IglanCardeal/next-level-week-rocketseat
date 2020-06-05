import { Request, Response } from 'express';

import knex from '../database/connection';

export default {
  index: (request: Request, response: Response) => {
    const { search = '' } = request.query;

    return response.json(search);
  },

  create: (request: Request, response: Response) => {
    return response.json({
      name: 'Cardeal',
      email: 'test@email.com',
    });
  },

  show: (request: Request, response: Response) => {
    const userId = request.params.id;

    return response.json({
      message: 'Listar 1 Usuario!',
      name: 'Cardeal',
      userId,
    });
  },
};
