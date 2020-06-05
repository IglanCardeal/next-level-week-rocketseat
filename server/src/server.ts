import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

import usersRoutes from './routes/users.routes';
import itemsRoutes from './routes/items.routes';
import pointsRoutes from './routes/points.routes';

const app = express();
const imagesPath = path.resolve(__dirname, '..', 'uploads');

dotenv.config();

const ORIGIN_URL: string = String(process.env.ORIGIN_URL);
const PORT: number = Number(process.env.PORT);
const API_METHODS: string = String(process.env.API_METHODS);

app.use(
  cors({
    origin: ORIGIN_URL,
    methods: API_METHODS,
  }),
);
app.use(express.json());
app.use(usersRoutes);
app.use(itemsRoutes);
app.use(pointsRoutes);
app.use('/uploads', express.static(imagesPath));

app.listen(PORT, () => console.log(`Server started.\nPort: ${PORT}`));
