import { Router} from 'express';
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import { checkAuthorization } from '../../middleware/authorizationMiddleware';
import { UsersController } from '../controllers/users-controllers';
import {container} from '../../composition-root';

export const usersRouter = Router();

const usersController = container.get(UsersController);

usersRouter.get('/', checkAuthorization, objectValidateMetods.getUsersSearch, usersController.getUsersController.bind(usersController));
usersRouter.post('/', checkAuthorization, objectValidateMetods.postUsers, usersController.postUsersController.bind(usersController));
usersRouter.delete('/:id', checkAuthorization, objectValidateMetods.deleteUsers, usersController.deleteUserByIdController.bind(usersController));
