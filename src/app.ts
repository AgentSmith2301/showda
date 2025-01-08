import express, { Router, Request, Response } from 'express';
import { videoRolter } from './/videos-module/routers/videoRouts';
import { blogRouter } from './blogs-module/routers/blogRouts';
import { postRouter } from './posts-module/routers/postRouts';
import { SETTINGS } from './settings';
import {methodsDB} from './videos-module/repositories/videosRepository'
import {metodsPostsDB} from './posts-module/repositories/postsRepositories'
import {metodsBlogsDB} from './blogs-module/repositories/blogsRepositories'

export const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({version: '4.0'});
})

app.delete(SETTINGS.PATH.DELETEALL, async(req: Request, res: Response) => {
    methodsDB.deleteAll();
    metodsBlogsDB.deleteAll();
    metodsPostsDB.deleteAll();
    res.sendStatus(204);
})

app.use(SETTINGS.PATH.VIDEOS, videoRolter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.BLOGS, blogRouter)


