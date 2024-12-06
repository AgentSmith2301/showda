import {SETTINGS} from '../settings';
import { Request, Response, NextFunction } from 'express';

export const checkAuthorization = (req: Request, res: Response, next: NextFunction) => {
    if(Buffer.from(SETTINGS.ADMIN_AUTH).toString('base64') === req.headers.authorization?.substring(6)) {
        next();
    } else {
        res.send(401)
    }
}



