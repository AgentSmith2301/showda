import { Request, Response, NextFunction } from 'express';
import {rateLimiteRepositories} from '../repositories/rateLimiteRepositories' ;

export async function rateLimiteMiddleware(req: Request, res: Response, next: NextFunction) {
    let ip ;
    req.ip ? ip = req.ip : ip = 'ip not faund'
    let url = req.originalUrl;
    let dateNow = new Date(); 
    let checkDate = new Date(dateNow.valueOf() - 10000) 
    const result = await rateLimiteRepositories.check_Request_Caunt(ip, url, checkDate); 

    // при быстрых асинхронных запросах count может отставать, поэтому в rate limit всегда проверяют >= limit, 
    // чтобы не пропустить лишний запрос
    if(result >= 5) {
        res.sendStatus(429);
        return
    } 

    await rateLimiteRepositories.create_Url_Info(ip , url, dateNow)
    next()
    return
}





