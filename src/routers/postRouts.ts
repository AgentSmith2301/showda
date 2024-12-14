import {Router} from 'express';
import {checkAuthorization} from '../middleware/authorizationMiddleware'
import {objectValidateMetods} from '../middleware/validatorMiddleware'
import {getAllpostsController, getPostByIdController, deletePostByIdController, createPostConrtoller, changePostById} from '../controllers/postsControllers'


export const postRouter = Router();

postRouter.get('/', getAllpostsController)

postRouter.get('/:id', getPostByIdController)

postRouter.delete('/:id', checkAuthorization, deletePostByIdController)

postRouter.post('/', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, createPostConrtoller)

postRouter.put('/:id', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, changePostById)