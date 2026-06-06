import { QueryCommentsRepositories } from "../infrastructure/repositories/comments-query-repository";
import { CommentPostModel, CommentViewModel, PaginatorCommentViewModel } from "../types/comments-type";
import {Result} from '../../types/resultObject-type'
import { ResultStatus } from "../../types/resultStatus-enum";
import {LikeDB, LikeStatus} from "../../like-module/type/like-types";
import { LikeReppositories } from "../../like-module/infrastructure/repositories/like-repositories";
import {injectable, inject} from "inversify";
import { GetQueryPosts } from "../../posts-module/types/dbType";

@injectable()
export class CommentQyeryService {
    constructor(
        @inject(QueryCommentsRepositories) public queryCommentsRepositories: QueryCommentsRepositories,
        @inject(LikeReppositories) public likeRepositories: LikeReppositories
    ) {}

    async getCommentByIdService(id: string): Promise<CommentViewModel | null> {
        const comment = await this.queryCommentsRepositories.getCommentByIdRepositories(id);

        if(!comment) {
            return null
        } else {
            const userId = comment.commentatorInfo.userId;
            const likeUnlire: LikeDB | null = await this.likeRepositories.findLikeInfoRepositories(userId, id);
            return {
                id: comment._id!.toString(),
                content: comment.content,
                commentatorInfo: comment.commentatorInfo,
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: comment.likesCount,
                    dislikesCount: comment.dislikesCount,
                    myStatus: likeUnlire?.myStatus || LikeStatus.NONE
                }
            }
        }
    }

    async getAllComments(postId: string, filter: GetQueryPosts): Promise<PaginatorCommentViewModel> {
        return await this.queryCommentsRepositories.getAllComments(postId, filter);
    }

}
















