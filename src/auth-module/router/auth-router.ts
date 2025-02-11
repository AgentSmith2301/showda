import {Router} from 'express';
import { authorization, getDataById } from '../controllers/auth-controller'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'

export const authRouter = Router();

authRouter.post('/login', objectValidateMetods.auth , authorization)
authRouter.get('/me', bearerAuthorization, getDataById)



// тебе нужно расширить тип запроса , нужно что бы мы получили id и передали его из мидлевеера в следующую функцию обработчик
// вроде ты наследование сделал и расширил запрос , проверь все