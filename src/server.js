import express, { json } from 'express';

import categoriesRoutes from './routes/categoriesRoutes.js';
import cors from 'cors';
import { customersRoutes } from './routes/customersRoutes.js';
import dotenv from 'dotenv';
import { gamesRoutes } from './routes/gamesRoutes.js';

dotenv.config();

const server = express();

server.use(cors(), json());

server.use(categoriesRoutes);
server.use(gamesRoutes);
server.use(customersRoutes);

const PORT = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
	console.log(`The server is runnig on port: ${PORT}`);
});
