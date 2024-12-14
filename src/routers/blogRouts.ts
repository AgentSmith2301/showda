import {Router} from 'express';
import {checkAuthorization} from '../middleware/authorizationMiddleware'
import {objectValidateMetods} from '../middleware/validatorMiddleware'
import {createBlogController, deleteBlogController, changeBlogController, getBlogFromIdController, getAllBlogsController} from '../controllers/blogsControllers'

export const blogRouter = Router();

// создать блог
blogRouter.post('/', checkAuthorization, objectValidateMetods.postAndPutReqvestbodyValBlogs, createBlogController)

// получить все блоги
blogRouter.get('/', getAllBlogsController)

// получить блог по id
blogRouter.get('/:id', getBlogFromIdController)

// изменить блог
blogRouter.put('/:id', checkAuthorization, objectValidateMetods.postAndPutReqvestbodyValBlogs, changeBlogController)

// удалить блог
blogRouter.delete('/:id', checkAuthorization, deleteBlogController)


