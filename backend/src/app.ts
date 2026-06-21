import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);
app.use(errorHandler);

export default app;
