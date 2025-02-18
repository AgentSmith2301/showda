import { queryCommentsRepositories } from "../repositories/comments-query-repositoryes";
import { commentsRepositories } from "../repositories/comments-repositoryes";
import { CommentPostModel, CommentViewModel } from "../types/comments-type";


export const serviceComments = {
    
    async createComment(data: CommentPostModel): Promise<CommentViewModel | undefined>  {
        const result = await commentsRepositories.createComment(data);
        let answer: undefined | CommentViewModel = undefined;
        if(result.acknowledged) {
            // answer = await queryCommentsRepositories.getCommentById(result.insertedId.toString())
            answer = await queryCommentsRepositories.getCommentById(result.insertedId)

            
        } else {
            answer = undefined
        }
        return answer   
    },

    // async getComments() {
        
    // }
}

