import express, { Request, Response } from 'express';
import { videoRolter } from './/videos-module/routers/videoRouts';
import { blogRouter } from './blogs-module/routers/blogRouts';
import { postRouter } from './posts-module/routers/postRouts';
import {usersRouter} from './users-module/routers/users-routers';
import { SETTINGS } from './settings';
import {methodsDB} from './videos-module/repositories/videosRepository'
import {metodsPostsDB} from './posts-module/repositories/postsRepositories'
import {metodsBlogsDB} from './blogs-module/repositories/blogsRepositories'
import {usersRepoMethods} from './users-module/repositories/users-repositories';
import { authRouter } from './auth-module/router/auth-router'
import {commentsRouter} from './comments-module/routers/comments-router'
import { commentsRepositories } from './comments-module/repositories/comments-repository';

export const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({version: '5.0'});
})

app.delete(SETTINGS.PATH.DELETEALL, async(req: Request, res: Response) => {
    methodsDB.deleteAll();
    metodsBlogsDB.deleteAll();
    metodsPostsDB.deleteAll();
    usersRepoMethods.deleteAll();
    commentsRepositories.deleteAll();
    res.sendStatus(204);
})

app.use(SETTINGS.PATH.VIDEOS, videoRolter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)



