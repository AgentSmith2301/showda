import { Router} from 'express';
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import { checkAuthorization } from '../../middleware/authorizationMiddleware';
import { postUsersController, getUsersController, deleteUserByIdController } from '../controllers/users-controllers';
export const usersRouter = Router();

usersRouter.get('/', checkAuthorization, objectValidateMetods.getUsersSearch, getUsersController);
usersRouter.post('/', checkAuthorization, objectValidateMetods.postUsers, postUsersController);
usersRouter.delete('/:id', checkAuthorization, objectValidateMetods.deleteUsers, deleteUserByIdController)