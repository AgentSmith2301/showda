import express, { Router, Request, Response } from 'express';
import cors from 'cors';
import { videoRolter } from './videos/videoRouts';
import { SETTINGS } from './settings';
import {methodsDB} from './db/db'

export const app = express();
app.use(express.json());
// app.use(cors());


app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'});
})

app.delete(SETTINGS.PATH.DELETEALL, (req: Request, res: Response) => {
    methodsDB.deleteAll();
    res.send(204);
})

app.use(SETTINGS.PATH.VIDEOS, videoRolter)