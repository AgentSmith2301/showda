import {Router} from 'express';
import {AuthController} from '../controllers/auth-controller'
import { objectValidateMetods } from '../../middleware/validatorMiddleware';
import {bearerAuthorization} from '../../middleware/authorizationMiddleware';
import {rateLimiteMiddleware} from '../middleware/rateLimiteMiddleware';
import {checkRefreshToken} from '../../middleware/checkTokenMiddleware';
import { sessionMiddleware } from '../../middleware/checkSessionMiddleware';
import {container} from '../../composition-root'

export const authRouter = Router();
const authController =  container.get(AuthController); 

// TODO delete tracker requestTrack & file in middleware request_Tracking andspy Data
authRouter.post('/login', rateLimiteMiddleware, objectValidateMetods.auth, authController.authorization.bind(authController)) 
authRouter.post('/registration', rateLimiteMiddleware, objectValidateMetods.registrationValidator, authController.registrationUserController.bind(authController)) 
authRouter.post('/registration-confirmation', rateLimiteMiddleware, objectValidateMetods.confirmationCOde, authController.confirmation_User_Fron_Code.bind(authController)) 
authRouter.post('/registration-email-resending', rateLimiteMiddleware, objectValidateMetods.emailResending, authController.resendEmail.bind(authController)) 
authRouter.get('/me', bearerAuthorization, authController.getDataById.bind(authController))
authRouter.post('/refresh-token', checkRefreshToken, sessionMiddleware, authController.refresh.bind(authController)) 
authRouter.post('/logout', checkRefreshToken, sessionMiddleware, authController.logout.bind(authController)) 
// отправка письма на почту для востановления пароля
authRouter.post('/password-recovery', rateLimiteMiddleware, objectValidateMetods.emailRecovery, authController.passwordRecovery.bind(authController)) 
// изменить пароль 
authRouter.post('/new-password', rateLimiteMiddleware, objectValidateMetods.newPassword, authController.newPassword.bind(authController)) 


// =========================== (маршрут для проверки фронта) ===========================
authRouter.get('/frontend/check-email', authController.frontend_Side_Registration.bind(authController))
// authRouter.get('/frontend/password-recovery', authController.frontend_Side_Get_Password.bind(authController))




