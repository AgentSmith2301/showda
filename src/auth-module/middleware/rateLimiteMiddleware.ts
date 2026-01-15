import { Request, Response, NextFunction } from 'express';
import {rateLimiteRepositories} from '../repositories/rateLimiteRepositories' ;

export async function rateLimiteMiddleware(req: Request, res: Response, next: NextFunction) {
    let ip ;
    req.ip ? ip = req.ip : ip = 'ip not faund'
    let url = req.originalUrl;
    let dateNow = new Date(); 
    //TODO здесь не правильная логика (не нужно отнимать , нужно к этой дате прибавить 10000 и поис делать в диапозоне этих значений)
    // let checkDate = new Date(dateNow.valueOf() - 10000) 
    // const result = await rateLimiteRepositories.check_Request_Caunt(ip, url, checkDate); // передай еще парамет date в эту функцию
    let checkDate = new Date(dateNow.valueOf() - 10000) 
    const result = await rateLimiteRepositories.check_Request_Caunt(ip, url, dateNow, checkDate); 

    if(result < 5) {
        await rateLimiteRepositories.create_Url_Info(ip , url, dateNow)
        next()
    } else {
        res.sendStatus(429)
    }


}





