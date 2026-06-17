import { Request, Response, NextFunction } from 'express';
import {jwtService} from '../auth-module/application/jwt-service'

export async function getUserInformationFromToken(req: Request, res: Response, next: NextFunction) {     
    const token = req.headers.authorization?.split(' ')
    if(token && token[1]) {
        const authToken = await jwtService.getIdByToken(token[1])
        req.userId = authToken;
    }
    next(); 
}




