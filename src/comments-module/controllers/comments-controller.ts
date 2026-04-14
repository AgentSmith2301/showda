import {Response, Request} from 'express'
import { QueryCommentsRepositories } from '../repositories/comments-query-repository'
import { ObjectId } from 'mongodb'
import { CommentViewModel } from '../types/comments-type' // CastomRequest
import { CommentsRepositories } from '../repositories/comments-repository'
import { ServiceComments } from '../service/comments-service'
import { jwtService } from '../../auth-module/application/jwt-service'
import { validationResult } from 'express-validator'
import { castomError } from '../../errors/castomErrorsFromValidate'
import {HttpStatusCode} from '../../types/httpStatus-enum'
import { ResultStatus } from '../../types/resultStatus-enum'
import { resultStatusToHttpCode } from '../../helpers/resultStatusToHttpCode'
import {injectable, inject} from 'inversify';

@injectable()
export class CommentsController {
    constructor(
        @inject(QueryCommentsRepositories) public queryCommentsRepositories: QueryCommentsRepositories,
        @inject(ServiceComments) public serviceComments: ServiceComments
    ) {}

    async getCommentByIdController(req: Request, res: Response) {
        const result = await this.queryCommentsRepositories.getCommentByIdRepositories(req.params.id as string);

        if(result) {
            res.status(200).send(result)
            return
        } else {
            res.sendStatus(404)
            return
        }
    }

    async deleteCommentByIdController(req: Request, res: Response) {
        
        const commentId = req.params.comeentId as string;
        const userId = req.userId;

        const result = await this.serviceComments.deleteCommentByIdService(commentId, userId!);
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

    async updateCommentController(req: Request, res: Response) {
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
        
        const result = await this.serviceComments.updateComment(req.userId!, req.params.comeentId as string, req.body.content);

        res.status(resultStatusToHttpCode(result.status!)).end()

    }

}




