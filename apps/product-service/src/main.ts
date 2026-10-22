/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/product.routes';
// import swaggerUi from 'swagger-ui-express';
// const swaggerDocument = require("./swagger-output.json");
const app = express();
app.use(cors({
  origin: ['http://localhost:3000'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to product-service!' });
});
// app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get('/docs-json', (req, res) => {
  //   res.json(swaggerDocument);
  // });
app.use('/api', router);
app.use(errorMiddleware);
const port = 5002;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  console.log(`Swagger docs available at http://localhost:${port}/docs-json`);
});
server.on('error', console.error);
