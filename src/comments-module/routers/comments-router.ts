import {Router} from 'express';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import { CommentsController } from '../controllers/comments-controller';
import {getUserInformationFromToken} from '../../middleware/middlewareForLikeInfo'
import {container} from '../../composition-root';
const commentsController = container.get(CommentsController); // получаем экземпляр CommentsController из контейнера Inversify

export const commentsRouter = Router();
commentsRouter.put('/:commentId', bearerAuthorization, objectValidateMetods.updateCommentsValidator, commentsController.updateCommentController.bind(commentsController))
commentsRouter.get('/:id', getUserInformationFromToken, commentsController.getCommentByIdController.bind(commentsController))
commentsRouter.delete('/:commentId', bearerAuthorization, commentsController.deleteCommentByIdController.bind(commentsController))
commentsRouter.put('/:commentId/like-status', bearerAuthorization, objectValidateMetods.likeStatusValidator, commentsController.likeUnlikeCommentController.bind(commentsController))



