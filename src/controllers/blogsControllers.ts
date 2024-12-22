import {Response, Request, NextFunction} from 'express';
import {errorFromBlogsAndPosts} from '../errors/castomErrorsFromValidate'
import {metodsBlogsDB} from '../repositories/blogsRepositories';

import {validationResult} from 'express-validator'


export async function createBlogController(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ // добавить в array( {onlyFirstError: true} )
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            errorFromBlogsAndPosts.errorsMessages.push(value);
        })
        res.status(400).send(errorFromBlogsAndPosts);
        errorFromBlogsAndPosts.errorsMessages = []; // очистка ошибок
        return 
    } else {
        const reult = await metodsBlogsDB.createBlog(req.body);
        res.status(201).send(reult)
        return 
    }
}

export async function deleteBlogController(req: Request, res: Response) {
    const checkId = await metodsBlogsDB.checkId(req.params.id);
    if(checkId === false) {
        res.sendStatus(404)
    }
    const result = await metodsBlogsDB.deleteBlog(req.params.id);
    if(result) {
        res.sendStatus(204)
    } 
}

export async function changeBlogController(req: Request, res: Response) {
    const checkId = await metodsBlogsDB.checkId(req.params.id);
    if(checkId === false) {
        res.send(404)
        return
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ // добавить в array( {onlyFirstError: true} )
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            errorFromBlogsAndPosts.errorsMessages.push(value);
        })
        res.status(400).send(errorFromBlogsAndPosts);
        errorFromBlogsAndPosts.errorsMessages = []; // очистка ошибок
    } 
    
    let result = await metodsBlogsDB.updateBlog(req.params.id, req.body);
    if(result) {
        res.send(204)
    } else {
        res.send(404)
    }
}

export async function getBlogFromIdController(req: Request, res: Response) {
    const result = await metodsBlogsDB.getBlog(req.params.id);
    if(result) {
        res.status(200).send(result)
    } else {
        res.send(404);
    }
}

export async function getAllBlogsController(req: Request, res: Response) {
    const result = await metodsBlogsDB.getAll();
    res.status(200).send(result)
}




