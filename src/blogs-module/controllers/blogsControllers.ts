import {Response, Request, NextFunction} from 'express';
import {castomError} from '../../errors/castomErrorsFromValidate'
import {serviceBlogsMethods} from '../service/blogs-service';
import {getBlogMethods} from '../repositories/blogs-query-repository'
import {validationResult} from 'express-validator'
import { BlogPostInputModel, GetQueryBlogs} from '../types/dbType';
// import {GetQueryPosts} from '../../posts-module/types/dbType';
import { getPostsMetodsDb } from '../../posts-module/repositories/posts-query-repository';
// import {getBlogMethods} from '../repositories/blogs-query-repository';


export async function createBlogController(req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ // добавить в array( {onlyFirstError: true} )
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            castomError.errorsMessages.push(value);
        })
        res.status(400).send(castomError);
        castomError.errorsMessages = []; // очистка ошибок
        return 
    } else {
        const reult = await serviceBlogsMethods.createBlog(req.body);
        res.status(201).send(reult)
        return 
    }
}
// контролер для создания поста по id для блога
export async function createPostFromBlogWithIdController(req: Request, res: Response) { 
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ // добавить в array( {onlyFirstError: true} )
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            castomError.errorsMessages.push(value);
        })
        res.status(400).send(castomError);
        castomError.errorsMessages = []; // очистка ошибок
        return 
    } else {
        let checkId = req.params.blogId;
        let filter: BlogPostInputModel = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content
        };
        // сообщением что блог с таким id не существует
        let isTrue = await serviceBlogsMethods.checkId(checkId)
        if(isTrue === false) {
            res.status(404).send('not faund blogId');
            return
        }
        let result = await serviceBlogsMethods.createPostForBlogWithId(checkId, filter)
        res.status(201).send(result)
        return 
    }
}

export async function deleteBlogController(req: Request, res: Response) {
    const checkId = await serviceBlogsMethods.checkId(req.params.id);
    if(checkId === false) {
        res.sendStatus(404)
    }
    const result = await serviceBlogsMethods.deleteBlog(req.params.id);
    if(result) {
        res.sendStatus(204)
    } 
}

export async function changeBlogController(req: Request, res: Response) {
    const checkId = await serviceBlogsMethods.checkId(req.params.id);
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
            castomError.errorsMessages.push(value);
        })
        res.status(400).send(castomError);
        castomError.errorsMessages = []; // очистка ошибок
        return
    } 
    
    let result = await serviceBlogsMethods.updateBlog(req.params.id, req.body);
    if(result) {
        res.send(204)
    } else {
        res.send(404)
    }
}

export async function getBlogFromIdController(req: Request, res: Response) {
    const result = await getBlogMethods.getBlog(req.params.id)
    if(result) {
        res.status(200).send(result)
    } else {
        res.send(404);
    }
}

export async function getAllBlogsController(req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ // добавить в array( {onlyFirstError: true} )
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
    
    let filter: GetQueryBlogs = {};
    if(req.query.searchNameTerm) filter.searchNameTerm = req.query.searchNameTerm.toString()
    filter.sortBy = req.query.sortBy!.toString();
    if(req.query.sortDirection === 'asc') {
        filter.sortDirection = 1
    } else {
        filter.sortDirection = -1
    }
    filter.pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
    filter.pageSize = req.query.pageSize ? +req.query.pageSize : 10

    const result =  await getBlogMethods.getAll(filter);
    res.status(200).send(result)
}

export async function getPostsWithBlogId(req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ // добавить в array( {onlyFirstError: true} )
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

    let pageNumber: number = +req.query.pageNumber!;
    let pageSize: number = +req.query.pageSize!;
    let sortBy: string = req.query.sortBy!.toString();
    let sortDirection: 1 | -1 = req.query.sortDirection === 'asc' ? 1 : -1; 
    let blogId: string = req.params.blogId;

    let filter = {pageNumber, pageSize, sortBy, sortDirection};

    const checkId = await serviceBlogsMethods.checkId(blogId);
    if(checkId === false) {
        res.status(404).send('not faund blogId')
        return
    }

    let result = await getBlogMethods.getAllPostsFromBlogId(blogId, filter);
    
    res.status(200).send(result);
    return
}



