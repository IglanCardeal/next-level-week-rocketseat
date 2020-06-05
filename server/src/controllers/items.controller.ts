import { Request, Response } from 'express';
import dotenv from 'dotenv';

import knex from '../database/connection';

dotenv.config();

export default {
  index: async (request: Request, response: Response) => {
    const items = await knex.select('*').from('items');
    // Definir uma base URL nas variaveis de ambiente.
    const baseUrl = process.env.BASE_URL;

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `${baseUrl}/uploads/${item.image}`,
      };
    });

    return response.status(200).json(serializedItems);
  },
};
