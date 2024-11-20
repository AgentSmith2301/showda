import {Router, Response, Request, NextFunction} from 'express';
import {metodsPostsDB, metodsBlogsDB} from '../repositories/postAndBlogRepository';
import {checkAuthorization} from './middleware/authorizationMiddleware'
import {validationResult} from 'express-validator'
import {objectValidateMetods} from './middleware/validatorMiddleware'
import {errorFromBlogsAndPosts} from '../errors/castomErrorsFromValidate'

export const postRouter = Router();
export const blogRouter = Router();

// POSTS
postRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(metodsPostsDB.getAll())
})

postRouter.delete('/:id', (req: Request, res: Response) => {
    // вернуть 401 если не авторизован
    // if() {}
    let result = metodsPostsDB.deletePost(req.params.id);
    if(result) {
        res.send(204);
    } else {
        res.send(404);
    }
    
})

postRouter.post('/', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, (req: Request, res: Response, next: NextFunction) => {
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



    res.status(200).send(req.body)
})

// BLOGS
blogRouter.post('/', checkAuthorization, objectValidateMetods.postAndPutReqvestbodyValBlogs, (req: Request, res: Response, next: NextFunction) => {
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

    res.status(200).send(metodsBlogsDB.createBlog(req.body))
})

blogRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(metodsBlogsDB.getAll())
})

blogRouter.get('/:id', (req: Request, res: Response) => {
    const result = metodsBlogsDB.getBlog(req.params.id);
    if(result) {
        res.status(200).send(result)
    } else {
        res.send(404);
    }
})

blogRouter.put('/:id', checkAuthorization, objectValidateMetods.postAndPutReqvestbodyValBlogs, (req: Request, res: Response) => {
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
})

blogRouter.delete('/:id', checkAuthorization, (req: Request, res: Response) => {
    const checkId = metodsBlogsDB.checkId(req.params.id);
    if(checkId === false) {
        res.send(404)
    }

    const result = metodsBlogsDB.deleteBlog(req.params.id);
    if(metodsBlogsDB) {
        res.send(204)
    } {
        res.send(404)
    }
})
