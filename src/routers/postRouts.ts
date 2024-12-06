import {Router} from 'express';
// import {metodsPostsDB} from '../repositories/postAndBlogRepository';
import {checkAuthorization} from '../middleware/authorizationMiddleware'
// import {validationResult} from 'express-validator'
import {objectValidateMetods} from '../middleware/validatorMiddleware'
// import {errorFromBlogsAndPosts} from '../errors/castomErrorsFromValidate'
import {getAllpostsController, getPostByIdController, deletePostByIdController, createPostConrtoller, changePostById} from '../controllers/postsControllers'


export const postRouter = Router();

postRouter.get('/', getAllpostsController)

postRouter.get('/:id', getPostByIdController)

postRouter.delete('/:id', checkAuthorization, deletePostByIdController)

postRouter.post('/', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, createPostConrtoller)

postRouter.put('/:id', checkAuthorization, objectValidateMetods.postReqvestbodyValPosts, changePostById)