import {Router} from 'express';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import { CommentsController } from '../controllers/comments-controller';
import {container} from '../../composition-root';
const commentsController = container.get(CommentsController); // получаем экземпляр CommentsController из контейнера Inversify

export const commentsRouter = Router();
commentsRouter.put('/:comeentId', bearerAuthorization, objectValidateMetods.updateCommentsValidator, commentsController.updateCommentController.bind(commentsController))
commentsRouter.get('/:id', commentsController.getCommentByIdController.bind(commentsController))
commentsRouter.delete('/:comeentId', bearerAuthorization, commentsController.deleteCommentByIdController.bind(commentsController))





