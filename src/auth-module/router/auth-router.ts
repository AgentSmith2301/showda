import {Router} from 'express';
import { authorization, getDataById } from '../controllers/auth-controller'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'

export const authRouter = Router();

authRouter.post('/login', objectValidateMetods.auth , authorization)
authRouter.get('/me', bearerAuthorization, getDataById)
