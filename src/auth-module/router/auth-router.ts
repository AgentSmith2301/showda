import {Router} from 'express';
import { authorization } from '../controllers/auth-controller'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';

export const authRouter = Router();

authRouter.post('/login', objectValidateMetods.auth , authorization)
// authRouter.get('/me')
