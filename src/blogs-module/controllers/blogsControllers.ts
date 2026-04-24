import {Response, Request, NextFunction} from 'express';
import {castomError} from '../../errors/castomErrorsFromValidate'
import {BlogsService} from '../service/blogs-service';
import {GetBlogMethods} from '../infrastructure/repositories/blogs-query-repository'
import {validationResult} from 'express-validator'
import { BlogPostInputModel, GetQueryBlogs} from '../types/dbType';
// import {GetQueryPosts} from '../../posts-module/types/dbType';
// import { getPostsMetodsDb } from '../../posts-module/repositories/posts-query-repository';
// import {getBlogMethods} from '../repositories/blogs-query-repository';
import {injectable, inject } from 'inversify';  


@injectable()
export class BlogsControllers {

    constructor(
        @inject(BlogsService) public blogsService: BlogsService,
        @inject(GetBlogMethods) public getBlogMethods: GetBlogMethods
    
    ) {}

    async createBlogController(req: Request, res: Response) {
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
            try {
                const result = await this.blogsService.createBlog(req.body);
                res.status(201).send(result)
            } catch (error) {
                console.error('❌ Controller error creating blog:', error);
                res.status(500).send({ error: 'Failed to create blog' });
            }
            return 
        }
    }
    // контролер для создания поста по id для блога
    async createPostFromBlogWithIdController(req: Request, res: Response) { 
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
            let checkId : string = req.params.blogId as string;
            let filter: BlogPostInputModel = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content
            };
            // сообщением что блог с таким id не существует
            let isTrue = await this.blogsService.checkId(checkId);
            if(isTrue === false) {
                res.status(404).send('not faund blogId');
                return
            }
            let result = await this.blogsService.createPostForBlogWithId(checkId, filter)
            res.status(201).send(result)
            return
        }
    }

    async deleteBlogController(req: Request, res: Response) {
        const checkId: boolean = await this.blogsService.checkId(req.params.id as string);
        if(checkId === false) {
            res.sendStatus(404)
        }
        const result = await this.blogsService.deleteBlog(req.params.id as string);
        if(result) {
            res.sendStatus(204)
        } 
    }

    async changeBlogController(req: Request, res: Response) {
        const checkId = await this.blogsService.checkId(req.params.id as string);
        if(checkId === false) {
            res.sendStatus(404)
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
        
        let result = await this.blogsService.updateBlog(req.params.id as string, req.body);
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async getBlogFromIdController(req: Request, res: Response) {
        const result = await this.getBlogMethods.getBlog(req.params.id as string)
        if(result) {
            res.status(200).send(result)
        } else {
            res.sendStatus(404);
        }
    }

    async getAllBlogsController(req: Request, res: Response) {
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

        const result =  await this.getBlogMethods.getAll(filter);
        res.status(200).send(result)
    }

    async getPostsWithBlogId(req: Request, res: Response) {
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
        let blogId: string = req.params.blogId as string;

        let filter = {pageNumber, pageSize, sortBy, sortDirection};

        const checkId = await this.blogsService.checkId(blogId);
        if(checkId === false) {
            res.status(404).send('not faund blogId')
            return
        }

        let result = await this.getBlogMethods.getAllPostsFromBlogId(blogId, filter);
        
        res.status(200).send(result);
        return
    }

}





