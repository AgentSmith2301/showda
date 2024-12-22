import express, { Router, Request, Response } from 'express';
import { videoRolter } from './routers/videoRouts';
import { blogRouter } from './routers/blogRouts';
import { postRouter } from './routers/postRouts';
import { SETTINGS } from './settings';
import {methodsDB} from './repositories/videosRepository'
import {metodsPostsDB} from './repositories/postsRepositories'
import {metodsBlogsDB} from './repositories/blogsRepositories'

export const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({version: '2.0'});
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


