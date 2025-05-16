import {Response, Request} from 'express'
import { queryCommentsRepositories } from '../repositories/comments-query-repository'
import { ObjectId } from 'mongodb'
import { CommentViewModel } from '../types/comments-type' // CastomRequest
import { commentsRepositories } from '../repositories/comments-repository'
import { serviceComments } from '../service/comments-service'
import { jwtService } from '../../auth-module/application/jwt-service'
import { validationResult } from 'express-validator'
import { castomError } from '../../errors/castomErrorsFromValidate'
import {HttpStatusCode} from '../../types/httpStatus-enum'
import { ResultStatus } from '../../types/resultStatus-enum'
import { resultStatusToHttpCode } from '../../helpers/resultStatusToHttpCode'


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
    
    const commentId = req.params.comeentId;
    const userId = req.userId;

    const result = await serviceComments.deleteCommentByIdService(commentId, userId!);
    switch (result.status) {
        case ResultStatus.NotFound: 
            res.sendStatus(resultStatusToHttpCode(ResultStatus.NotFound))  // 404
            break;

        case ResultStatus.NoContent:
            res.sendStatus(resultStatusToHttpCode(ResultStatus.NoContent)) // 204
            break;

        case ResultStatus.Forbidden:
            res.sendStatus(resultStatusToHttpCode(ResultStatus.Forbidden)) //403
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
        res.status(HttpStatusCode.BadRequest_400).send(castomError);
        castomError.errorsMessages = []; // очистка ошибок
        return
    }

    // TODO перенести условия в бизнесс логику
    // получить комментарий по id для сравнения userId
    // const comment = await queryCommentsRepositories.getCommentByIdRepositories(req.params.comeentId)
    // if(!comment) {
    //     res.sendStatus(HttpStatusCode.NotFound_404)
    //     return
    // } else if(req.userId !== comment?.commentatorInfo.userId) {
    //     res.sendStatus(HttpStatusCode.Forbidden_403)
    //     return
    // }
    
    const result = await serviceComments.updateComment(req.userId!, req.params.comeentId, req.body.content);
    // switch (result.status) {
    //     case ResultStatus.NotFound :

    // }

    res.status(resultStatusToHttpCode(result.status!)).end()

    
    // if(result.modifiedCount) {
    //     res.sendStatus(HttpStatusCode.NoContent_204);
    //     return
    // }

    // if(!result.modifiedCount) {
    //     res.status(HttpStatusCode.ServerError_500).send('something wrong with the server');
    //     return
    // }
}


