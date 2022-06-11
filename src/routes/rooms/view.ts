import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  console.log(req);
  res.send(`Joining ${req.params.roomCode} as a viewer.`);
}
