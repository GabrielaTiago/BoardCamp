import express, { json } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import router from './routers/router.js';

dotenv.config();

const server = express();

server.use(cors(), json());
server.use(router);

const PORT = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
	console.log(`The server is runnig on port: ${PORT}`);
});
