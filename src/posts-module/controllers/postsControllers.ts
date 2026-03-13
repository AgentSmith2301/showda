import {Response, Request, NextFunction} from 'express';
import {castomError} from '../../errors/castomErrorsFromValidate'
import {ServicePostsMethods} from '../service/posts-service';
import { getPostsMetodsDb } from '../repositories/posts-query-repository'
import {validationResult} from 'express-validator'
import { GetQueryPosts } from '../types/dbType';
import {jwtService} from '../../auth-module/application/jwt-service'
import {BlogsService} from '../../blogs-module/service/blogs-service';

import { injectable, inject } from 'inversify';

@injectable()
export class PostsControllerststs {
    
    constructor(
        @inject(ServicePostsMethods) public servicePostsMethods: ServicePostsMethods,
        @inject(BlogsService) public blogsService: BlogsService
    ) {}

    async getAllpostsController(req: Request, res: Response) {
        let pageNumber = +req.query.pageNumber!;
        let pageSize = +req.query.pageSize!;
        let sortBy = req.query.sortBy?.toString();
        let sortDirection: 1|-1 ;
        if(req.query.sortDirection === "asc") {
            sortDirection = 1;
        } else {
            sortDirection = -1;
        }

        let filter: GetQueryPosts = {pageNumber, pageSize, sortBy, sortDirection}
        
        const result = await getPostsMetodsDb.getAll(filter);
        res.status(200).send(result)

    }

    async getPostByIdController(req: Request, res: Response) {
        const result = await getPostsMetodsDb.getPost(req.params.id);
        if(result) {
            res.send(result)
        } else {
            res.sendStatus(404)
        }
    }

    async deletePostByIdController(req: Request, res: Response) {
        let result =  await this.servicePostsMethods.deletePost(req.params.id);
        if(result) {
            res.sendStatus(204);
        }else {
            res.sendStatus(404);
        }
    }

    async createPostConrtoller(req: Request, res: Response) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
                message: error.msg.message || error.msg,
                field: error.path
            }))
            filterErrors.map((value) => {
                castomError.errorsMessages.push(value);
            })
            res.status(400).send(castomError);
            castomError.errorsMessages = []; // очистка ошибок
            return
        } 
        
        const checkIdBlog = await this.blogsService.checkId(req.body.blogId)
        if(checkIdBlog) {  // если id блогера найдено
            const result = await this.servicePostsMethods.createPost(req.body);
            res.status(201).send(result)
            return
        } else { // если не нашли id блогера то ошибка
            castomError.errorsMessages.push({
                message: 'blogerName not faund',
                field: 'blogerName'
            })
            res.status(400).send(castomError);
            castomError.errorsMessages = []; // очистка ошибок
            return
        }
    }

    async changePostById(req: Request, res: Response) {
        const result = await this.servicePostsMethods.updatePost(req.params.id, req.body);

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
                message: error.msg.message || error.msg,
                field: error.path
            }))
            filterErrors.map((value) => {
                castomError.errorsMessages.push(value);
            })
            res.status(400).send(castomError);
            castomError.errorsMessages = []; // очистка ошибок
        } else if(result) { // если не нашли id блогера то ошибка
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
        
    }

    async postCommentsByPostId(req: Request, res: Response) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
                message: error.msg.message || error.msg,
                field: error.path
            }))
            filterErrors.map((value) => {
                castomError.errorsMessages.push(value);
            })
            res.status(400).send(castomError);
            castomError.errorsMessages = []; // очистка ошибок
            return
        } 
        // проверка на существование поста
        const result = await getPostsMetodsDb.getPost(req.params.postId);
        if(result === null) {
            res.sendStatus(404)
            return
        }
        // получить токен  
        const token = req.headers.authorization?.split(' ')
        // верификация токена и получение id
        const userId = await jwtService.getIdByToken(token![1])
        const responseData =  await this.servicePostsMethods.commentsFromPost(req.params.postId, req.body.content, userId!)
        if(!responseData) res.status(500).send("something wrong with the server")
        res.status(201).send(responseData)
    }

    async getAllCommentsByPostId(req: Request, res: Response) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
                message: error.msg.message || error.msg,
                field: error.path
            }))
            filterErrors.map((value) => {
                castomError.errorsMessages.push(value);
            })
            res.status(400).send(castomError);
            castomError.errorsMessages = []; // очистка ошибок
            return
        } 
        // проверка на существование поста
        const result = await getPostsMetodsDb.getPost(req.params.postId);
        if(result === null) {
            res.sendStatus(404)
            return
        }

        let sortDirection: 1|-1 ;
        if(req.query.sortDirection === "asc") {
            sortDirection = 1;
        } else {
            sortDirection = -1;
        }
        
        const filter = { 
            pageNumber: +req.query.pageNumber! ,
            pageSize: +req.query.pageSize! ,
            sortBy: req.query.sortBy!.toString() ,
            sortDirection: sortDirection
        }
        
        const comments = await getPostsMetodsDb.getAllCommentsByPostId(req.params.postId, filter)
        res.status(200).send(comments)
        

    }

}