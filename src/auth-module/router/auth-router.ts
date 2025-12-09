import {Router} from 'express';
import { authorization, getDataById, registrationUserController, frontend_Side_Registration, confirmation_User_Fron_Code, resendEmail, refresh, logout } from '../controllers/auth-controller'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware'

export const authRouter = Router();

authRouter.post('/login', objectValidateMetods.auth , authorization)
authRouter.post('/registration', objectValidateMetods.registrationValidator, registrationUserController)
authRouter.post('/registration-confirmation', objectValidateMetods.confirmationCOde, confirmation_User_Fron_Code)
authRouter.post('/registration-email-resending', objectValidateMetods.emailResending, resendEmail)
authRouter.get('/me', bearerAuthorization, getDataById)
authRouter.post('/refresh-token', refresh) //TODO вернуть время жизни токена на 10 и 20 секунд в jwt service
authRouter.post('/logout', logout)

// =========================== (маршрут для проверки фронта) ===========================
authRouter.get('/frontend/check-email', frontend_Side_Registration)



