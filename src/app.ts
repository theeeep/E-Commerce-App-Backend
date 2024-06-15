import express, { Express } from 'express';
import rootRouter from 'rootRouter';

const app: Express = express();

// --> Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes Middleware
app.use('/api', rootRouter);

export default app;
