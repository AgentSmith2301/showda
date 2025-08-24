import {Router} from 'express';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'
import { deleteCommentByIdController, getCommentByIdController, updateCommentController } from '../controllers/comments-controller';
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
// import {CastomRequest} from '../types/comments-type'

export const commentsRouter = Router();
commentsRouter.put('/:comeentId', bearerAuthorization, objectValidateMetods.updateCommentsValidator, updateCommentController)
commentsRouter.get('/:id', getCommentByIdController)
commentsRouter.delete('/:comeentId', bearerAuthorization, deleteCommentByIdController)





