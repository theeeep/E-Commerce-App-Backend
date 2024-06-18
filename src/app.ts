import express, { Express } from 'express';
import rootRouter from 'rootRouter';
import { errorMiddleware } from 'middlewares/errors';
import postmanToOpenApi from 'postman-to-openapi';
import swaggerUi from 'swagger-ui-express';

import swaggerJson from '../openapi.json';

const app: Express = express();

// --> Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

// Routes Middleware
app.use('/api', rootRouter);

// Error Middleware
app.use(errorMiddleware);

app.get('/generate-yml', async () => {
  // Postman Collection Path
  const postmanCollection = 'collection.json';

  // Output OpenAPI Path
  const outputFile = 'collection.yml';

  // Async/await
  try {
    const result = await postmanToOpenApi(postmanCollection, outputFile, {
      defaultTag: 'General',
    });

    // Without save the result in a file
    console.log(`OpenAPI specs: ${result}`);
  } catch (err) {
    console.log(err);
  }
});

export default app;
