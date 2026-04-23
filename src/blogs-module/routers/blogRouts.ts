import {Router} from 'express';
import {checkAuthorization} from '../../middleware/authorizationMiddleware'
import {objectValidateMetods} from '../../middleware/validatorMiddleware'
import {container} from '../../composition-root';
import {BlogsControllers} from '../controllers/blogsControllers';

const blogsControllers = container.get(BlogsControllers); // получаем экземпляр BlogsControllers из контейнера Inversify

export const blogRouter = Router();

// создать блог (/blogs)
blogRouter.post('/', checkAuthorization, objectValidateMetods.postAndPutReqvestbodyValBlogs, blogsControllers.createBlogController.bind(blogsControllers))

// создать к конкретному блогу пост 
blogRouter.post('/:blogId/posts', checkAuthorization, objectValidateMetods.postFromBlogWithId, blogsControllers.createPostFromBlogWithIdController.bind(blogsControllers))

// получить все блоги (/blogs)
blogRouter.get('/', objectValidateMetods.blogsQueryValidation , blogsControllers.getAllBlogsController.bind(blogsControllers))

// получить блог по id
blogRouter.get('/:id', blogsControllers.getBlogFromIdController.bind(blogsControllers))

// получить к конкретному блогу посты (дополнительно обрабатывая query запросы)
blogRouter.get('/:blogId/posts', objectValidateMetods.getPostsWithIdBlogs, blogsControllers.getPostsWithBlogId.bind(blogsControllers))

// изменить блог
blogRouter.put('/:id', checkAuthorization, objectValidateMetods.postAndPutReqvestbodyValBlogs, blogsControllers.changeBlogController.bind(blogsControllers))

// удалить блог
blogRouter.delete('/:id', checkAuthorization, blogsControllers.deleteBlogController.bind(blogsControllers))

