import express, { Router } from 'express';
import cors from 'cors';
import { videoRolter } from './videos/videoRouts';
import { SETTINGS } from './settings';

export const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'});
})


app.use(SETTINGS.PATH.VIDEOS, videoRolter)