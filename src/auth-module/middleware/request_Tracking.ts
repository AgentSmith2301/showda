import { Request, Response, NextFunction } from 'express';
import fs from 'node:fs/promises'

export async function requestTrack(req: Request, res: Response, next: NextFunction) {

    const infoSpay = {
        ip: req.ip,
        url: req.originalUrl,
        dateRequest: new Date(),
        body: req.body
    }


    const fh = await fs.open('./spyData.ts', 'a');
    await fh.write(`запрос: ${infoSpay} /n`)
    await fh.close()

    next()

}

