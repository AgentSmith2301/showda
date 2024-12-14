import {Response, Request, NextFunction} from 'express';
import {errorFromBlogsAndPosts} from '../errors/castomErrorsFromValidate'
import {metodsPostsDB} from '../repositories/postsRepositories';


import {validationResult} from 'express-validator'


export function getAllpostsController(req: Request, res: Response) {
    res.status(200).send(metodsPostsDB.getAll())
}

export function getPostByIdController(req: Request, res: Response) {
    const result =  metodsPostsDB.getPost(req.params.id);
    if(result) {
        res.send(result)
    } else {
        res.sendStatus(404)
    }
}

export function deletePostByIdController(req: Request, res: Response) {
    let result = metodsPostsDB.deletePost(req.params.id);
    console.log(result, ' from delete')
    if(result >= 0) {
        res.send(204);
    } else {
        res.send(404);
    }
}

export function createPostConrtoller(req: Request, res: Response, next: NextFunction) {
    const result = metodsPostsDB.createPost(req.body);
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
    } else if(result.blogName === 'NOT FIND') { // если не нашли id блогера то ошибка
        errorFromBlogsAndPosts.errorsMessages.push({
            message: 'blogerName not faund',
            field: 'blogerName'
        })
        res.status(400).send(errorFromBlogsAndPosts);
        errorFromBlogsAndPosts.errorsMessages = []; // очистка ошибок
    } else {
        res.status(201).send(result)
    }
    
}

export function changePostById(req: Request, res: Response, next: NextFunction) {
    const result = metodsPostsDB.updatePost(req.params.id, req.body);

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


