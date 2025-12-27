import {Router} from 'express';
import { authorization, getDataById, registrationUserController, frontend_Side_Registration, confirmation_User_Fron_Code, resendEmail } from '../controllers/auth-controller'
// , refresh, logout
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'

export const authRouter = Router();

//TODO реализовать отслеживание запросов по ip (больше 5 запросов за 10 сек ошибка 429)
authRouter.post('/login', objectValidateMetods.auth , authorization) 
authRouter.post('/registration', objectValidateMetods.registrationValidator, registrationUserController)
authRouter.post('/registration-confirmation', objectValidateMetods.confirmationCOde, confirmation_User_Fron_Code)
authRouter.post('/registration-email-resending', objectValidateMetods.emailResending, resendEmail)
authRouter.get('/me', bearerAuthorization, getDataById)
// authRouter.post('/refresh-token', refresh) 
// authRouter.post('/logout', logout)

// =========================== (маршрут для проверки фронта) ===========================
authRouter.get('/frontend/check-email', frontend_Side_Registration)



