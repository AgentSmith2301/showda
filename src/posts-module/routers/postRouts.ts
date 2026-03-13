import {Router} from 'express';
import {checkAuthorization} from '../../middleware/authorizationMiddleware'
import {objectValidateMetods} from '../../middleware/validatorMiddleware'
import {PostsControllerststs} from '../controllers/postsControllers'
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'
import {container} from '../../composition-root';
const postsControllers = container.get(PostsControllerststs); // получаем экземпляр PostsControllerststs из контейнера Inversify

export const postRouter = Router();
postRouter.get('/', objectValidateMetods.postsQueryValidation, postsControllers.getAllpostsController.bind(postsControllers))
postRouter.get('/:id', postsControllers.getPostByIdController.bind(postsControllers))
postRouter.delete('/:id', checkAuthorization, postsControllers.deletePostByIdController.bind(postsControllers))
postRouter.post('/', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, postsControllers.createPostConrtoller.bind(postsControllers))
postRouter.put('/:id', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, postsControllers.changePostById.bind(postsControllers))

postRouter.post('/:postId/comments', bearerAuthorization, objectValidateMetods.postComments, postsControllers.postCommentsByPostId.bind(postsControllers))
postRouter.get('/:postId/comments', objectValidateMetods.searchCommentsWithIdPosts, postsControllers.getAllCommentsByPostId.bind(postsControllers))





