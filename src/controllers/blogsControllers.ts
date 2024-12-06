import {Response, Request, NextFunction} from 'express';
import {errorFromBlogsAndPosts} from '../errors/castomErrorsFromValidate'
import {metodsBlogsDB} from '../repositories/postAndBlogRepository';
import {validationResult} from 'express-validator'


export function createBlogController(req: Request, res: Response, next: NextFunction) {
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
    res.status(201).send(metodsBlogsDB.createBlog(req.body))
}

export function deleteBlogController(req: Request, res: Response) {
    const checkId = metodsBlogsDB.checkId(req.params.id);
    if(checkId === false) {
        res.sendStatus(404)
    }
    const result = metodsBlogsDB.deleteBlog(req.params.id);
    if(result) {
        res.sendStatus(204)
    } 
}

export function changeBlogController(req: Request, res: Response) {
    const checkId = metodsBlogsDB.checkId(req.params.id);
    if(checkId === false) {
        res.send(404)
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
    
    let result = metodsBlogsDB.updateBlog(req.params.id, req.body);
    if(result) {
        res.send(204)
    } else {
        res.send(404)
    }
}

export function getBlogFromIdController(req: Request, res: Response) {
    const result = metodsBlogsDB.getBlog(req.params.id);
    if(result) {
        res.status(200).send(result)
    } else {
        res.send(404);
    }
}

export function getAllBlogsController(req: Request, res: Response) {
    res.status(200).send(metodsBlogsDB.getAll())
}




