import {Router} from 'express';
import {checkAuthorization} from '../../middleware/authorizationMiddleware'
import {objectValidateMetods} from '../../middleware/validatorMiddleware'
import {
    getAllpostsController, 
    getPostByIdController, 
    deletePostByIdController, 
    createPostConrtoller, 
    changePostById,
    postCommentsByPostId,
    getAllCommentsByPostId
} from '../controllers/postsControllers'
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'

export const postRouter = Router();
postRouter.get('/', objectValidateMetods.postsQueryValidation, getAllpostsController)
postRouter.get('/:id', getPostByIdController)
postRouter.delete('/:id', checkAuthorization, deletePostByIdController)
postRouter.post('/', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, createPostConrtoller)
postRouter.put('/:id', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, changePostById)

postRouter.post('/:postId/comments', bearerAuthorization, objectValidateMetods.postComments, postCommentsByPostId)
postRouter.get('/:postId/comments', objectValidateMetods.searchCommentsWithIdPosts, getAllCommentsByPostId)





