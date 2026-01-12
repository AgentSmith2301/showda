import {DeviceViewModel} from '../types/securityTypes';
import {authServiceMethods} from '../../auth-module/service/auth-service'
import { Sessions_Info } from '../../auth-module/types/auth-type';
import { Result } from '../../types/resultObject-type';
import { ResultStatus } from '../../types/resultStatus-enum';


export const securityService = {
    
    async allDevaceFromUserId(userId: string): Promise<Result<DeviceViewModel[]>> {
        const info = await authServiceMethods.getAllSessionsForUser(userId);
        let securityDTO: DeviceViewModel[] = [] ;
        for(let i of info.data) {
            securityDTO.push({
                ip: i.ip! ,
                title: i.deviceName,
                lastActiveDate: i.iat.toISOString() ,
                deviceId: i.deviceId 
            })
        }
        
        return {
            status: info.status,
            errorsMessages: info.errorsMessages,
            extensions: info.extensions,
            data: securityDTO
        } 
    },

    async deleteAllOtherSessions(userId: string, deviceId: string): Promise<Result<boolean>> {
        return await authServiceMethods.deleteAllOtherSessions(userId, deviceId);
    },

    async closeSession(userId: string, deviceId: string): Promise<Result<null|boolean>> {
        
        const allSessions = await authServiceMethods.getInfoByDeviceId(deviceId);
        // проверка на 404 (нет такого deviceId)
        if(!allSessions.data.length) {
            const serviceAnserDTO: Result = {
                status: ResultStatus.NotFound, 
                errorsMessages: 'device not faund', 
                extensions: [
                    {field: 'deviceId', message: 'deviceId does not exist in the database'}
                ],
                data: null
            }
            return serviceAnserDTO
        }
        
        // проверкa на 403 
        if(!allSessions.data.find(i => i.userId === userId)) {
            const serviceAnserDTO: Result = {
                status: ResultStatus.Forbidden, 
                errorsMessages: 'device not faund', 
                extensions: [
                    {field: 'deviceId', message: 'deviceId does not exist in the database'}
                ],
                data: null
            }
            return serviceAnserDTO
        } else {
            const response = await authServiceMethods.closeSession(userId, deviceId);
            const serviceAnserDTO: Result<boolean> = {
                status: ResultStatus.NoContent, 
                errorsMessages: 'device not faund', 
                extensions: [
                    {field: 'deviceId', message: 'deviceId does not exist in the database'}
                ],
                data: response.data
            }
            return serviceAnserDTO
        }
        

        
    }
}








