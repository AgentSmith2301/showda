import {Router} from 'express';
import { authorization, getDataById, registrationUserController, frontend_Side_Registration, confirmation_User_Fron_Code, resendEmail, refresh, logout} from '../controllers/auth-controller'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware';
import {rateLimiteMiddleware} from '../middleware/rateLimiteMiddleware';
import {checkRefreshToken} from '../../middleware/checkTokenMiddleware';
import { sessionMiddleware } from '../../middleware/checkSessionMiddleware';

export const authRouter = Router();

authRouter.post('/login', rateLimiteMiddleware, objectValidateMetods.auth, authorization) 
authRouter.post('/registration', rateLimiteMiddleware, objectValidateMetods.registrationValidator, registrationUserController) 
authRouter.post('/registration-confirmation', rateLimiteMiddleware, objectValidateMetods.confirmationCOde, confirmation_User_Fron_Code) 
authRouter.post('/registration-email-resending', rateLimiteMiddleware, objectValidateMetods.emailResending, resendEmail) 
authRouter.get('/me', bearerAuthorization, getDataById)
authRouter.post('/refresh-token', checkRefreshToken, sessionMiddleware, refresh) 
authRouter.post('/logout', checkRefreshToken, sessionMiddleware, logout) 

// =========================== (маршрут для проверки фронта) ===========================
authRouter.get('/frontend/check-email', frontend_Side_Registration)



