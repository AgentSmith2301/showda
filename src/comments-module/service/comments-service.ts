import { queryCommentsRepositories } from "../repositories/comments-query-repository";
import { commentsRepositories } from "../repositories/comments-repository";
import { CommentPostModel, CommentViewModel } from "../types/comments-type";
import {Result} from '../../types/resultObject-type'
import { ResultStatus } from "../../types/resultStatus-enum";


export const serviceComments = {
    
    async createComment(data: CommentPostModel): Promise<CommentViewModel | null>  {
        const result = await commentsRepositories.createComment(data);
        let answer: null | CommentViewModel ;
        if(result.acknowledged) {
            // answer = await queryCommentsRepositories.getCommentById(result.insertedId.toString())
            answer = await queryCommentsRepositories.getCommentByIdRepositories(result.insertedId.toString())
            
        } else {
            answer = null
        }
        return answer   
    },

    async deleteCommentByIdService(commentId:string, userId: string): Promise<Partial<Result>> { 
        const getComment = await queryCommentsRepositories.getCommentByIdRepositories(commentId)
        if(!getComment) {
            return {status: ResultStatus.NotFound , errorsMessages: 'Commentary with such ID does not exist'} // 404
        }

        if(userId !== getComment?.commentatorInfo.userId) {
            return {status: ResultStatus.Forbidden , errorsMessages: 'The comment does not belong to the user'} // 403
        }

        const result = await commentsRepositories.deleteCommentByIdRepository(commentId);
        if(result.acknowledged) {
            return {status: ResultStatus.NoContent } // 204
        } else { 
            return {status: ResultStatus.ServerError , errorsMessages: 'Database error, comment is not deleted'} // 500
        }

    },

    async updateComment(userId: string, comentId: string, content: string): Promise<Partial<Result>> {
        const hasCommentInDB = await queryCommentsRepositories.getCommentByIdRepositories(comentId);
        if(!hasCommentInDB) return {status: ResultStatus.NotFound , errorsMessages: 'ID comment was not found'} // 404
        if(hasCommentInDB?.commentatorInfo.userId !== userId) return {status: ResultStatus.Forbidden, errorsMessages: 'The comment does not belong to the user'} // 403
        
        // {status: , errorsMessages: , extensions: , data: }
        const result = await commentsRepositories.updateComment(comentId, content);
        if(!result.acknowledged) return {status: ResultStatus.ServerError} // 500
        return {status: ResultStatus.NoContent} //204
    }


}

