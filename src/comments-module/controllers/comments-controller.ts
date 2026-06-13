import {Response, Request} from 'express'
import { ObjectId } from 'mongodb'
import { CommentViewModel } from '../types/comments-type' // CastomRequest
import { CommentsRepositories } from '../infrastructure/repositories/comments-repository'
import { ServiceComments } from '../service/comments-service'
import { jwtService } from '../../auth-module/application/jwt-service'
import { validationResult } from 'express-validator'
import { castomError } from '../../errors/castomErrorsFromValidate'
import {HttpStatusCode} from '../../types/httpStatus-enum'
import { ResultStatus } from '../../types/resultStatus-enum'
import { resultStatusToHttpCode } from '../../helpers/resultStatusToHttpCode'
import { Result } from '../../types/resultObject-type'
import {CommentQyeryService} from '../service/comment-query-service';
import {injectable, inject} from 'inversify';


@injectable()
export class CommentsController {
    constructor(
        @inject(CommentQyeryService) public commentQueryService: CommentQyeryService,
        @inject(ServiceComments) public serviceComments: ServiceComments
    ) {}

    async getCommentByIdController(req: Request, res: Response) {
        const result = await this.commentQueryService.getCommentByIdService(req.params.id as string);

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
        
        const result: Partial<Result> = await this.serviceComments.updateComment(req.userId!, req.params.commentId as string, req.body.content);
        res.status(resultStatusToHttpCode(result.status!)).end()
    }

    async likeUnlikeCommentController(req: Request, res: Response) {
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
        
        const likeStatus: string = req.body.likeStatus;
        const commentId: string = req.params.commentId as string;
        const userId: string = req.userId!;
        const result: Partial<Result> = await this.serviceComments.likeOrDislikeService(userId, commentId, likeStatus);

        if(result.status === ResultStatus.NoContent) {
            res.sendStatus(resultStatusToHttpCode(ResultStatus.NoContent)) // 204
        } else if(result.status === ResultStatus.ServerError) {
            res.status(resultStatusToHttpCode(ResultStatus.ServerError)).send(result.errorsMessages) // 500 
        } else if(result.status === ResultStatus.NotFound) {
            res.status(resultStatusToHttpCode(ResultStatus.NotFound)).send(result.errorsMessages) // 404
        }
        


    }

}




