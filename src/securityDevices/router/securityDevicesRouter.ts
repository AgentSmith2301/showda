import {Router} from 'express';
import {checkRefreshToken} from '../../middleware/checkTokenMiddleware';
import {securityControllers} from '../controllers/securityControllers'

export const securityRouter = Router();
securityRouter.get('/devices', checkRefreshToken, securityControllers.getAllActiveSessionsForUser)
securityRouter.delete('/devices', checkRefreshToken, securityControllers.deleteAllOtherSessions)
securityRouter.delete('/devices/:deviceId', checkRefreshToken, securityControllers.closeSession)






