import {Response, Request, NextFunction} from 'express';
import {errorFromBlogsAndPosts} from '../errors/castomErrorsFromValidate'
import {servicePostsMethods} from '../service/posts-service';
import {serviceBlogsMethods} from '../service/blogs-service';
import { getPostsMetodsDb } from '../repositories/posts-query-repository'

import {validationResult} from 'express-validator'
import { GetQueryPosts } from '../types/dbType';


export async function getAllpostsController(req: Request, res: Response) {
    let queryObject = {...req.query}; //TODO delete this stroke
    console.log(queryObject, ' <== queryObject из файла postsControlers, 13 строка'); //TODO delete this stroke "queryObject"

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

export async function getPostByIdController(req: Request, res: Response) {
    const result = await getPostsMetodsDb.getPost(req.params.id);
    if(result) {
        res.send(result)
    } else {
        res.sendStatus(404)
    }
}

export async function deletePostByIdController(req: Request, res: Response) {
    let result =  await servicePostsMethods.deletePost(req.params.id);
    if(result) {
        res.send(204);
    }else {
        res.send(404);
    }
}

export async function createPostConrtoller(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            errorFromBlogsAndPosts.errorsMessages.push(value);
        })
        res.status(400).send(errorFromBlogsAndPosts);
        errorFromBlogsAndPosts.errorsMessages = []; // очистка ошибок
        return
    } 
    
    const checkIdBlog = await serviceBlogsMethods.checkId(req.body.blogId)
    if(checkIdBlog) {  // если id блогера найдено
        const result = await servicePostsMethods.createPost(req.body);
        res.status(201).send(result)
        return
    } else { // если не нашли id блогера то ошибка
        errorFromBlogsAndPosts.errorsMessages.push({
            message: 'blogerName not faund',
            field: 'blogerName'
        })
        res.status(400).send(errorFromBlogsAndPosts);
        errorFromBlogsAndPosts.errorsMessages = []; // очистка ошибок
        return
    }
}

export async function changePostById(req: Request, res: Response, next: NextFunction) {
    const result = await servicePostsMethods.updatePost(req.params.id, req.body);

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            errorFromBlogsAndPosts.errorsMessages.push(value);
        })
        res.status(400).send(errorFromBlogsAndPosts);
        errorFromBlogsAndPosts.errorsMessages = []; // очистка ошибок
    } else if(result) { // если не нашли id блогера то ошибка
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
    
}


