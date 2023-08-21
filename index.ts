import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { IndexRouter } from './src/routes';
import swaggerUI from "swagger-ui-express";
import { Paths } from './src/helper/path';
import bodyParser from 'body-parser';
import { SwaggerSpecifications } from './swagger';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(Paths.Docs.Base, swaggerUI.serve, swaggerUI.setup(SwaggerSpecifications))

app.use(Paths.Base, IndexRouter)

app.use(function (err: any, req: any, res: any, next: any) {
  // Handle errors here
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running on port ${port}`);
});

process.on('warning', e => console.warn(e.stack));

// initiateConnection();