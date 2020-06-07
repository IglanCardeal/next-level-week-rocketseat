import { Request, Response } from 'express';
import validator from 'validator';
import dotenv from 'dotenv';

import knex from '../database/connection';

dotenv.config();

const BASE_URL = process.env.BASE_URL;

export default {
  index: async (request: Request, response: Response) => {
    let { city = '', uf = '', items = '' } = request.query;

    city = String(city).toLowerCase();
    uf = String(uf).toLowerCase();

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    let points;

    try {
      if (uf === '' && city) {
        points = await knex('points').select('*').where('city', city);
      } else {
        points = await knex('points')
          .join('point_item', 'points.id', '=', 'point_item.point_id')
          .whereIn('point_item.item_id', parsedItems)
          .where('city', city)
          .where('uf', uf)
          .distinct()
          .select('points.*'); // somente dados da tabela points.
      }

      const serializedPoints = points.map((point) => {
        return {
          ...point,
          image_url: `${BASE_URL}/uploads/${point.image}`,
        };
      });

      return response.status(200).json(serializedPoints);
    } catch (error) {
      console.log(error);

      return response.status(200).json({
        message: 'Erro interno de servidor ao listar pontos de coleta.',
      });
    }
  },

  create: async (request: Request, response: Response) => {
    const {
      name,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude,
      items,
    } = request.body;

    const point = {
      name: String(name).toLowerCase(),
      email: String(email).toLowerCase(),
      whatsapp,
      city: String(city).toLowerCase(),
      uf: String(uf).toLowerCase(),
      latitude,
      longitude,
      image: request.file.filename,
    };

    const trx = await knex.transaction();

    try {
      const [point_id] = await trx('points').insert(point);

      const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
          return {
            item_id,
            point_id,
          };
        });

      await trx('point_item').insert(pointItems);

      await trx.commit();

      return response.status(200).json({
        msg: 'Ponto de coleta criado com sucesso!',
        point: {
          point_id,
          ...point,
          image_url: `${BASE_URL}/uploads/${point.image}`,
        },
      });
    } catch (error) {
      await trx.rollback();

      console.log(error);

      return response.status(400).json({
        msg:
          'Nao foi possivel cadastrar ponto de coleta. Tente novamente e verifique os items selecionados.',
      });
    }
  },

  show: async (request: Request, response: Response) => {
    const pointId = request.params.id;

    try {
      const point = await knex('points').where('id', pointId).first();

      const items = await knex('items')
        .join('point_item', 'items.id', '=', 'point_item.item_id')
        .where('point_item.point_id', pointId)
        .select('items.title');

      if (!point)
        return response.status(404).json({
          message: 'Nenhum ponto de coleta encontrado com esse id.',
        });

      return response.json({
        ...point,
        items,
        image_url: `${BASE_URL}/uploads/${point.image}`,
      });
    } catch (error) {
      console.log(error);

      return response.json({
        message:
          'Erro interno de servidor ao tentar encontrar ponto de coleta.',
      });
    }
  },
};
