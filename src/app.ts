import express from 'express';
import cors from 'cors';
import { SETTINGS } from './settings';
import { getVideosController } from './videos/getVideosController';
import { videosRouter } from './videos/index';

export const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'});
})

app.get(SETTINGS.PATH.VIDEOS, getVideosController)
app.use(SETTINGS.PATH.VIDEOS, videosRouter)


