import {Response, Request, NextFunction} from 'express';
import {errorFromBlogsAndPosts} from '../errors/castomErrorsFromValidate'
import {metodsPostsDB} from '../repositories/postsRepositories';
import {metodsBlogsDB} from '../repositories/blogsRepositories';


import {validationResult} from 'express-validator'


export async function getAllpostsController(req: Request, res: Response) {
    const result = await metodsPostsDB.getAll();
    res.status(200).send(result)

}

export async function getPostByIdController(req: Request, res: Response) {
    const result = await metodsPostsDB.getPost(req.params.id);
    if(result) {
        res.send(result)
    } else {
        res.sendStatus(404)
    }
}

export async function deletePostByIdController(req: Request, res: Response) {
    let result =  await metodsPostsDB.deletePost(req.params.id);
    if(result) {
        res.send(204);
    }else {
        res.send(404);
    }
}

export async function createPostConrtoller(req: Request, res: Response, next: NextFunction) {
    // const result = await metodsPostsDB.createPost(req.body);
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
    
    const checkIdBlog = await metodsBlogsDB.checkId(req.body.blogId)
    if(checkIdBlog) {  // если id блогера найдено
        const result = await metodsPostsDB.createPost(req.body);
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
    const result = await metodsPostsDB.updatePost(req.params.id, req.body);

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


