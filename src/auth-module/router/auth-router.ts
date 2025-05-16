import {Router} from 'express';
import { authorization, getDataById, registrationUserController } from '../controllers/auth-controller'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'

export const authRouter = Router();

authRouter.post('/login', objectValidateMetods.auth , authorization)
authRouter.post('/registration', objectValidateMetods.registrationValidator, registrationUserController)
// authRouter.post('/registration-confirmation', )
// authRouter.post('/registration-email-resending', )
authRouter.get('/me', bearerAuthorization, getDataById)

