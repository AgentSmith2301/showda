import {Router} from 'express';
import { authorization } from '../controllers/auth-controller'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';


export const userRouter = Router();

userRouter.post('/login', objectValidateMetods.auth , authorization)

// userRouter.get()



