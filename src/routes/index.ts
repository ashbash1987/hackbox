import { Express } from 'express';

import newRoom from './rooms/new';
import hostRoom from './rooms/host';
import playRoom from './rooms/play';
import viewRoom from './rooms/view';

export default (app: Express) => {
  app.use('/rooms/new', newRoom);
  app.use('/rooms/:roomCode/host', hostRoom);
  app.use('/rooms/:roomCode/play', playRoom);
  app.use('/rooms/:roomCode/view', viewRoom);
};
