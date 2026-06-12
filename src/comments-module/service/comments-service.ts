import { QueryCommentsRepositories } from "../infrastructure/repositories/comments-query-repository";
import { CommentsRepositories } from "../infrastructure/repositories/comments-repository";
import { CommentPostModel, CommentViewModel, incrementLikeCountForComment } from "../types/comments-type";
import {Result} from '../../types/resultObject-type'
import { ResultStatus } from "../../types/resultStatus-enum";
import {LikeService} from '../../like-module/service/like-service'
import {injectable, inject} from "inversify";
import {LikeDB, LikeStatus} from "../../like-module/type/like-types";

@injectable()
export class ServiceComments {
    constructor(
        @inject(QueryCommentsRepositories) public queryCommentsRepositories: QueryCommentsRepositories,
        @inject(CommentsRepositories) public commentsRepositories: CommentsRepositories,
        @inject(LikeService) public likeService: LikeService
    ) {}

    async createComment(data: CommentPostModel): Promise<CommentViewModel | null>  {
        const result = await this.commentsRepositories.createComment(data);
        let answer: null | CommentViewModel ;
        if(!result || result._id === undefined) {
            answer = null
            
        } else {

            answer = {
                id: result!._id.toString() ,
                content: result!.content,
                commentatorInfo: {
                    userId: result!.commentatorInfo.userId,
                    userLogin: result!.commentatorInfo.userLogin
                },
                createdAt: result!.createdAt,
                likesInfo: {
                    likesCount: result.likesCount,
                    dislikesCount: result.dislikesCount,
                    myStatus: LikeStatus.NONE
                }
            }
        }
        return answer   
    }

    async deleteCommentByIdService(commentId:string, userId: string): Promise<Partial<Result>> { 
        const getComment = await this.queryCommentsRepositories.getCommentByIdRepositories(commentId)
        if(!getComment) {
            return {status: ResultStatus.NotFound , errorsMessages: 'Commentary with such ID does not exist'} // 404
        }

        if(userId !== getComment?.commentatorInfo.userId) {
            return {status: ResultStatus.Forbidden , errorsMessages: 'The comment does not belong to the user'} // 403
        }

        const result = await this.commentsRepositories.deleteCommentByIdRepository(commentId);
        if(result.acknowledged) {
            return {status: ResultStatus.NoContent } // 204
        } else { 
            return {status: ResultStatus.ServerError , errorsMessages: 'Database error, comment is not deleted'} // 500
        }

    }

    async updateComment(userId: string, comentId: string, content: string): Promise<Partial<Result>> {
        const hasCommentInDB = await this.queryCommentsRepositories.getCommentByIdRepositories(comentId);
        if(!hasCommentInDB) return {status: ResultStatus.NotFound , errorsMessages: 'ID comment was not found'} // 404
        if(hasCommentInDB?.commentatorInfo.userId !== userId) return {status: ResultStatus.Forbidden, errorsMessages: 'The comment does not belong to the user'} // 403
        
        const result = await this.commentsRepositories.updateComment(comentId, content);
        if(!result.acknowledged) return {status: ResultStatus.ServerError} // 500
        return {status: ResultStatus.NoContent} //204
    }

    // async likeUnlike(userId: string, commentId: string, likeStatus: string): Promise<Partial<Result>> {
    //     let commentCheck: boolean = false; // тумблер для определения ответа 
    //     let likeCheck: boolean = false; // тумблер для определения ответа 

    //     // проверка на существование комментария
    //     const checkComment: CommentPostModel | null = await this.queryCommentsRepositories.getCommentByIdRepositories(commentId);
    //     if(!checkComment) return {status: ResultStatus.NotFound, errorsMessages: 'ID comment was not found'} // 404
        
    //     // проверка на наличие лайка или дизлайка от этого пользователя к этому комментарию
    //     const likeInfoDB: LikeDB | null = await this.likeService.findLikeInfoService(userId, commentId);

    //     // фильтр для увеличения значения 
    //     let directionCount: incrementLikeCountForComment = likeStatus === LikeStatus.LIKE ? {likesCount: 1} : {dislikesCount: 1}; 
        
    //     // если в базе DISLIKE/LIKE и пришел DISLIKE/LIKE (то же значение) , установить NONE , и уменьшить счетчик
    //     if(likeInfoDB && likeInfoDB.myStatus === likeStatus) {
    //         // directionCount = likeStatus === LikeStatus.LIKE ? {likesCount: -1} : {dislikesCount: -1}
    //         // commentCheck = await this.commentsRepositories.incrementLikeCount(commentId, directionCount);
    //         // likeStatus = LikeStatus.NONE
    //         // likeCheck = await this.likeService.chengeLikeStatusService(userId, commentId, likeStatus)
    //         likeCheck = true;
    //         commentCheck = true;
            
    //     } else if (likeInfoDB && likeInfoDB.myStatus !== LikeStatus.NONE && likeInfoDB.myStatus !== likeStatus && likeStatus !== LikeStatus.NONE) {
    //         // если был DISLIKE/LIKE и ставим DISLIKE/LIKE , то нужно понизить счетчик по старому статусу и повысить по новому статусу
    //         directionCount = likeStatus === LikeStatus.LIKE ? {likesCount: 1, dislikesCount: -1} : {likesCount: -1, dislikesCount: 1}
    //         likeCheck = await this.likeService.chengeLikeStatusService(userId, commentId, likeStatus);
    //         commentCheck = await this.commentsRepositories.chengeLikeAndDislikeCount(commentId, directionCount);

    //     } else if(likeInfoDB && likeInfoDB.myStatus !== LikeStatus.NONE && likeStatus === LikeStatus.NONE) {
    //         // если в базе есть DISLIKE/LIKE и если статус лайка не равно NONE , а запрос на лайк NONE то меняем статус лайка в базе
    //         directionCount = likeInfoDB.myStatus === LikeStatus.LIKE ? {likesCount: -1} : {dislikesCount: -1}
    //         likeCheck = await this.likeService.chengeLikeStatusService(userId, commentId, likeStatus)
    //         commentCheck = await this.commentsRepositories.incrementLikeCount(commentId, directionCount); 

    //     } else if(likeInfoDB && likeInfoDB.myStatus === LikeStatus.NONE && likeStatus !== LikeStatus.NONE) {
    //         // если в базе NONE , а пришел DISLIKE/LIKE
    //         directionCount = likeStatus === LikeStatus.LIKE ? {likesCount: 1} : {dislikesCount: 1}
    //         likeCheck = await this.likeService.chengeLikeStatusService(userId, commentId, likeStatus)
    //         commentCheck = await this.commentsRepositories.incrementLikeCount(commentId, directionCount);

    //     } else if(!likeInfoDB) {
    //         const likeInfo: LikeDB | null = await this.likeService.likeOrDislikeCreaterService(userId, commentId, likeStatus);
    //         if(!likeInfo) return {status: ResultStatus.ServerError, errorsMessages: 'Database error, like or dislike was not created'} // 500
    //         if(likeInfo) return {status: ResultStatus.NoContent}
    //     }

    //     // отправить ответ  
    //     if(commentCheck && likeCheck) {
    //             return {status: ResultStatus.NoContent} // 204
    //     } else if(!commentCheck) {
    //         return {
    //             status: ResultStatus.ServerError, 
    //             errorsMessages: 'error processing comments', // 500
    //             extensions: [{
    //                 field: 'comments',
    //                 message:'error in comment repository or database' 
    //             }]
    //         }
    //     } else if(!likeCheck) {
    //         return {
    //             status: ResultStatus.ServerError, 
    //             errorsMessages: 'like or dislike was not created', // 500
    //             extensions: [{
    //                 field: 'likesCount or dislikesCount',
    //                 message:'like count not updated' 
    //             }]
    //         }

    //     } else {
            
    //         return {
    //             status: ResultStatus.ServerError, 
    //             errorsMessages: 'unaccounted for event, this event should not have happened', // 500
    //             extensions: [{
    //                 field: 'undefined event',
    //                 message:'stub for unaccounted events and scripts' 
    //             }]
    //         }
    //     }
    // }

    async likeOrDislikeService(userId: string, commentId: string, likeStatus: string): Promise<Partial<Result>> {

        // проверка на существование комментария
        const checkComment: CommentPostModel | null = await this.queryCommentsRepositories.getCommentByIdRepositories(commentId);
        if(!checkComment) return {status: ResultStatus.NotFound, errorsMessages: 'ID comment was not found'} // 404
        // проверка на наличие лайка или дизлайка от этого пользователя к этому комментарию
        const likeInfoDB: LikeDB | null = await this.likeService.findLikeInfoService(userId, commentId);
        
        // лайка нет и пришел не NONE
        if(!likeInfoDB && likeStatus !== LikeStatus.NONE) {
            // создать DISLIKE/LIKE 
            const likeInfo: LikeDB | null = await this.likeService.likeOrDislikeCreaterService(userId, commentId, likeStatus);
            // фильтр для увеличения значения 
            let directionCount: incrementLikeCountForComment = likeStatus === LikeStatus.LIKE ? {likesCount: 1} : {dislikesCount: 1}; 
            // увеличить значение DISLIKE/LIKE в комментах
            const commentIncrimentInfo: boolean = await this.commentsRepositories.chengeLikeAndDislikeCount(commentId, directionCount);
            // возвращение ответа
            const like: boolean = likeInfo ? true : false
            return this.resultCreater(commentIncrimentInfo, like)
            // if(commentIncrimentInfo && likeInfo) return {status: ResultStatus.NoContent}
            // if(!commentIncrimentInfo && !likeInfo) {
            //     if(!likeInfo) return {status: ResultStatus.ServerError, errorsMessages: 'Database error, like or dislike was not created'} // 500
            //     if(!commentIncrimentInfo) return {status: ResultStatus.ServerError, errorsMessages: 'Database error, the number of DISLIKE/LIKE in comments has not changed'} // 500
            // }

        } else if(likeStatus === LikeStatus.NONE && likeInfoDB !== null) {
            // если пришел NONE и был DISLIKE/LIKE , то удалить документ лайка и уменьшить счетчик в комментарии
            const directionCount = likeInfoDB.myStatus === LikeStatus.LIKE ? {likesCount: -1} : {dislikesCount: -1}
            const likeDeleted: boolean = await this.likeService.deleteDocumentService(userId, commentId);
            const commentIncrimentInfo: boolean = await this.commentsRepositories.chengeLikeAndDislikeCount(commentId, directionCount);
            return this.resultCreater(commentIncrimentInfo, likeDeleted)
        } else if(likeInfoDB && likeInfoDB.myStatus !== likeStatus) { 
            // лайк есть в базе но не такой как пришел 
            const directionCount = likeStatus === LikeStatus.LIKE ? {likesCount: 1, dislikesCount: -1} : {likesCount: -1, dislikesCount: 1}
            const likeChenge: boolean = await this.likeService.chengeLikeStatusService(userId, commentId, likeStatus);
            const commentIncrimentInfo: boolean = await this.commentsRepositories.chengeLikeAndDislikeCount(commentId, directionCount);
            return this.resultCreater(commentIncrimentInfo, likeChenge)
        
        } else if(likeStatus === LikeStatus.NONE && !likeInfoDB ) {
            // если пришел NONE и был NONE (ничего не делать)
            return this.resultCreater(true, true)

        }  else if(likeInfoDB && likeInfoDB.myStatus === likeStatus) {
            // пришёл тот же статус что уже есть — ничего не делать
            return this.resultCreater(true, true)
        } else {
            return {
                status: ResultStatus.BadRequest, 
                errorsMessages: '  ¯\_(ヅ)_/¯ unaccounted for event, this event should not have happened', // 400}
            }
        }
        
    }

    resultCreater(comment: boolean, like: boolean): Partial<Result> {
        if(comment && like) return {status: ResultStatus.NoContent}
        if(!like) {
            return {
                status: ResultStatus.ServerError, 
                errorsMessages: 'Database error, like or dislike was not created'
            } 
        } else {
            return {
                status: ResultStatus.ServerError, 
                errorsMessages: 'Database error, the number of DISLIKE/LIKE in comments has not changed'
            }
        }
    } 

}

