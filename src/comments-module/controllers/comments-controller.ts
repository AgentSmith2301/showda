import {Response, Request} from 'express'
import { queryCommentsRepositories } from '../repositories/comments-query-repository'
import { ObjectId } from 'mongodb'
import { CommentViewModel } from '../types/comments-type' // CastomRequest
import { commentsRepositories } from '../repositories/comments-repository'
import { serviceComments } from '../service/comments-service'
import { jwtService } from '../../auth-module/application/jwt-service'
import { validationResult } from 'express-validator'
import { castomError } from '../../errors/castomErrorsFromValidate'

export async function getCommentByIdController(req: Request, res: Response) {
    const result = await queryCommentsRepositories.getCommentByIdRepositories(req.params.id);

    if(result) {
        res.status(200).send(result)
        return
    } else {
        res.sendStatus(404)
        return
    }
}

export async function deleteCommentByIdController(req: Request, res: Response) {
    // если не делать declaration то решенеи с расширением Request такое : 
    // оставляем req: Request в переменных функции и расширяем его локально :
        // в файле types.ts есть export interface CastomRequest extends Request {userId: string | null} для импорта
        // const castom = req as CastomRequest
        // const commentId = castom.params.comeentId;
        // const userId = castom.userId;
    // в таком испольнении это локальное рассширени и тебе придется делать тоже самое в других файлах
    
    const commentId = req.params.comeentId;
    const userId = req.userId;

    const result = await serviceComments.deleteCommentByIdService(commentId, userId!);
    switch (result) {
        case 404: 
            res.sendStatus(404)
            break;

        case 204:
            res.sendStatus(204)
            break;

        case 403:
            res.sendStatus(403)
            break;
    }
}

export async function updateCommentController(req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
            message: error.msg.message || error.msg,
            field: error.path
        }))
        filterErrors.map((value) => {
            castomError.errorsMessages.push(value);
        })
        res.status(400).send(castomError);
        castomError.errorsMessages = []; // очистка ошибок
        return
    }

    // получить комментарий по id для сравнения userId
    const comment = await queryCommentsRepositories.getCommentByIdRepositories(req.params.comeentId)
    if(!comment) {
        res.sendStatus(404)
        return
    } else if(req.userId !== comment?.commentatorInfo.userId) {
        res.sendStatus(403)
        return
    }
    
    const result = await serviceComments.updateComment(req.params.comeentId, req.body.content);
    if(result.modifiedCount) {
        res.sendStatus(204);
        return
    }

    if(!result.modifiedCount) {
        res.status(500).send('something wrong with the server');
        return
    }
}

