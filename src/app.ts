import express, { Request, Response } from 'express';
import { videoRolter } from './/videos-module/routers/videoRouts';
import { blogRouter } from './blogs-module/routers/blogRouts';
import { postRouter } from './posts-module/routers/postRouts';
import {usersRouter} from './users-module/routers/users-routers';
import { SETTINGS } from './settings';
import {methodsDB} from './videos-module/repositories/videosRepository'
import {MetodsPostsDB} from './posts-module/repositories/postsRepositories'
import {BlogsRepositories} from './blogs-module/repositories/blogsRepositories'
import {container} from './composition-root';

import {UsersRepoMethods} from './users-module/repositories/users-repositories';
import { authRouter } from './auth-module/router/auth-router'
import {commentsRouter} from './comments-module/routers/comments-router'
import { CommentsRepositories } from './comments-module/repositories/comments-repository';
import cookieParser from 'cookie-parser';
import {securityRouter} from './securityDevices/router/securityDevicesRouter';
import { AuthRepoMethods } from './auth-module/repositories/auth-repositories';
import 'reflect-metadata';
import { BlogsControllers } from './blogs-module/controllers/blogsControllers';

// const metodsBlogsDB = new BlogsRepositories();

export const app = express();
app.use(cookieParser());
app.use(express.json());
app.set('trust proxy', true);


app.get('/', (req, res) => {
    res.status(200).json({version: '5.0'});
})

app.delete(SETTINGS.PATH.DELETEALL, async(req: Request, res: Response) => {
    methodsDB.deleteAll();
    // удаляем все блоги через контейнер Inversify
    // мы не создаем экземпляр класса , а только получаем его из контейнера
    container.get(BlogsRepositories).deleteAll(); 
    container.get(MetodsPostsDB).deleteAll();
    container.get(AuthRepoMethods).deleteAll();
    container.get(UsersRepoMethods).deleteAll();
    container.get(CommentsRepositories).deleteAll();
    res.sendStatus(204);
})

app.use(SETTINGS.PATH.VIDEOS, videoRolter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.SECURITY, securityRouter)



