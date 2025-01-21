import {Router} from 'express';
import { authorization } from '../controllers/auth-controller'


export const userRouter = Router();

userRouter.post('/login', authorization)

// userRouter.get()



