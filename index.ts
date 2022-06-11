import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Hackbox.');
});

app.listen(port, () => {
  console.log(`⚡️ Hackbox is running on port ${port}!`);
});
