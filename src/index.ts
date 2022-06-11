import express, { Express } from 'express';
import dotenv from 'dotenv';

import routes from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

routes(app);

app.listen(port, () => {
  console.log(`⚡️ Hackbox is running on port ${port}!`);
});
