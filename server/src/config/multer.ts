import { Request, Express } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(
      __dirname,
      '..',
      '..',
      'uploads',
    ),
    filename: (request, file, callback) => {
      const hash = crypto.randomBytes(16).toString('hex');
      const format = file.mimetype.split('/')[1];

      const filename = `${hash}.${format}`; // Renomeia o nome do arquivo para evitar trolls, mas mantem
      // o formato original da imagem.

      callback(null, filename);
    },
  }),
  fileFiler: (
    request: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    const acceptedFormatTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const isValidFormatType = acceptedFormatTypes.includes(file.mimetype);

    if (!isValidFormatType) callback(null, false);
    else callback(null, true);
  },
};
