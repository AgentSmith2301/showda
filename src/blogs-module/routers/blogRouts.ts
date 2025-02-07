import {Router} from 'express';
import {checkAuthorization} from '../../middleware/authorizationMiddleware'
import {objectValidateMetods} from '../../middleware/validatorMiddleware'
import {createBlogController, deleteBlogController, changeBlogController, getBlogFromIdController, getAllBlogsController, createPostFromBlogWithIdController, getPostsWithBlogId} from '../controllers/blogsControllers'

export const blogRouter = Router();

// создать блог
blogRouter.post('/', checkAuthorization, objectValidateMetods.postAndPutReqvestbodyValBlogs, createBlogController)

// создать к конкретному блогу пост
blogRouter.post('/:blogId/posts', checkAuthorization, objectValidateMetods.postFromBlogWithId, createPostFromBlogWithIdController)

// получить все блоги
blogRouter.get('/', objectValidateMetods.blogsQueryValidation , getAllBlogsController)

// получить блог по id
blogRouter.get('/:id', getBlogFromIdController)

// получить к конкретному блогу посты (дополнительно обрабатывая query запросы)
blogRouter.get('/:blogId/posts', objectValidateMetods.getPostsWithIdBlogs, getPostsWithBlogId)

// изменить блог
blogRouter.put('/:id', checkAuthorization, objectValidateMetods.postAndPutReqvestbodyValBlogs, changeBlogController)

// удалить блог
blogRouter.delete('/:id', checkAuthorization, deleteBlogController)


