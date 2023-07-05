import express, { Request, Response } from "express";
import cors from 'cors'


const api = express();

api.use(express.json())
api.use(cors())

api.listen(3004, () => {
  console.log('listening on http://localhost:3004');
})

api.get('/pingg', (req: Request, res: Response) => {
  res.send('Pong!')
})