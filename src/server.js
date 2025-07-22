import express, { json } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';
import router from './routers/router.js';

dotenv.config();

const server = express();

server.use(cors(), json());
server.use(router);
server.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
	console.log(`The server is runnig on port: ${PORT}`);
});
