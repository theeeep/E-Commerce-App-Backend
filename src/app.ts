import express, { Express } from 'express';
import rootRouter from 'rootRouter';
import { errorMiddleware } from 'middlewares/errors';

const app: Express = express();

// --> Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes Middleware
app.use('/api', rootRouter);

// Error Middleware
app.use(errorMiddleware);

export default app;
