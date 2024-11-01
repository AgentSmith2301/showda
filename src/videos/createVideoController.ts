import {Request, Response} from 'express';
import {OutputErrorsType} from '../input-output-types/output-errors-type';
import {db} from '../db/db';
import {InputVideoType, Resolutions} from '../input-output-types/video-types';

const inputValidation = (video: InputVideoType) => {
    const errors: OutputErrorsType = {
        errorsMassages: []
    }

    if(!Array.isArray(video.availableResolution) || video.availableResolution.find(p => !Resolutions[p])) {
        errors.errorsMessages.push({
            message: 'error!!!', field: 'availableResolution'
        })
    }
    return errors
}


export const createVideoController = (req:Request<any, any, InputVideoType>, res: Response<any|OutputErrorsType>) => {
    const errors = inputValidation(req.body)
    if(errors.errorsMessages.length) {
        res.status(400).json(errors)
        return
    }

    const newVideo: any = {
        ...req.body,
        id: Date.now() + Math.random(),
    }
    db.videos = [...db.videos, newVideo]

    res.status(201).json(newVideo);

}



