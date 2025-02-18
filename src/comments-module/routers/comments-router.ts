import {Router} from 'express';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'

export const commentsRouter = Router();

commentsRouter.put('/:comeentId', bearerAuthorization, )

commentsRouter.get('/:id', )

commentsRouter.delete('/:comeentId', bearerAuthorization, )

//TODO дописать конечные функции обработчики




