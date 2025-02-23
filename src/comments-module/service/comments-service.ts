import { queryCommentsRepositories } from "../repositories/comments-query-repository";
import { commentsRepositories } from "../repositories/comments-repository";
import { CommentPostModel, CommentViewModel } from "../types/comments-type";


export const serviceComments = {
    
    async createComment(data: CommentPostModel): Promise<CommentViewModel | undefined>  {
        const result = await commentsRepositories.createComment(data);
        let answer: undefined | CommentViewModel = undefined;
        if(result.acknowledged) {
            // answer = await queryCommentsRepositories.getCommentById(result.insertedId.toString())
            answer = await queryCommentsRepositories.getCommentByIdRepositories(result.insertedId.toString())
            
        } else {
            answer = undefined
        }
        return answer   
    },

    async deleteCommentByIdService(commentId:string, userId: string): Promise< 403 | 204 | 404 > {
        const getComment = await queryCommentsRepositories.getCommentByIdRepositories(commentId)
        if(!getComment) {
            return 404
        }

        if(userId !== getComment?.commentatorInfo.userId) {
            return 403
        }

        const result = await commentsRepositories.deleteCommentByIdRepository(commentId);
        if(result.acknowledged) {
            return 204
        } else {
            return 404
        }

    },

    async updateComment(id: string, content: string) {
        return await commentsRepositories.updateComment(id, content)

    }
}

