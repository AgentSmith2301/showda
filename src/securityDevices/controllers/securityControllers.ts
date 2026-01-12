import {Request, Response} from 'express';
import { securityService } from '../service/securityService';
import { Refresh_Session_Token } from '../../types/refreshTokenType';
import { Result } from '../../types/resultObject-type';
import { ResultStatus } from '../../types/resultStatus-enum';
import { HttpStatusCode } from '../../types/httpStatus-enum';

export const securityControllers = {
    async getAllActiveSessionsForUser(req:Request, res:Response) {
        const response = await securityService.allDevaceFromUserId(req.tokenPayload.userId);
        if(response.status === ResultStatus.Success) res.status(HttpStatusCode.Success_200).send(response.data)
    },

    async deleteAllOtherSessions(req:Request, res:Response) {
        const token: Refresh_Session_Token = req.tokenPayload
        const response = await securityService.deleteAllOtherSessions(token.userId, token.deviceId);
        if(response.status === ResultStatus.NoContent) res.sendStatus(HttpStatusCode.NoContent_204)
        if(response.status === ResultStatus.ServerError) res.status(HttpStatusCode.ServerError_500).send(response.errorsMessages)
    },

    async closeSession(req:Request, res:Response) {
        const response = await securityService.closeSession(req.tokenPayload.userId, req.params.deviceId);
        if(response.status === ResultStatus.NotFound) res.sendStatus(HttpStatusCode.NotFound_404)
        if(response.status === ResultStatus.Forbidden) res.sendStatus(HttpStatusCode.Forbidden_403)
        if(response.status === ResultStatus.NoContent) res.sendStatus(HttpStatusCode.NoContent_204)

        
    }
}







