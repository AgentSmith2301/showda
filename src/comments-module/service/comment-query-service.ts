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

    async getCommentByIdService(userId: string | null, id: string): Promise<CommentViewModel | null> {
        const comment: CommentPostModel | null = await this.queryCommentsRepositories.getCommentByIdRepositories(id);
        if(!comment) {
            return null
        } else {
            
            let filter = {
                id: comment._id!.toString(),
                content: comment.content,
                commentatorInfo: comment.commentatorInfo,
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: comment.likesCount,
                    dislikesCount: comment.dislikesCount,
                    myStatus: LikeStatus.NONE 
                }
            }

            if(!userId) return filter;
            if(userId) {

                const likeUnlike: LikeDB | null = await this.likeRepositories.findLikeInfoRepositories(id, userId);
                filter.likesInfo.myStatus = likeUnlike?.myStatus ? likeUnlike.myStatus : LikeStatus.NONE
                
            }

            return filter
        }
    }

    // TODO нужно передать userId в функцию и поставить первым параметром в функцию findLikeInfoRepositories
    async getAllComments(userId: string | null,postId: string, filter: GetQueryPosts): Promise<PaginatorCommentViewModel> {
        const commentsInfoDb: {totalCaunt: number, searchDocument: CommentPostModel[]} = await this.queryCommentsRepositories.getAllComments(postId, filter);

        // после того как map пройдет по всем комментариям  и будет дожидаться завершения await на каждой итерации ,
        // нужно исполььзовать Promise.all и передать ему массив промисов , который вернет map, 
        // тогда мы будем уверены что все промисы завершены и получим массив с результатами всех промисов
        const mapedDocument = await Promise.all(commentsInfoDb.searchDocument.map(async(item) => {
            const likeUnlike: LikeDB | null = await this.likeRepositories.findLikeInfoRepositories(item._id!.toString(), userId);
            
            let infoMyStatus: LikeStatus
            if(userId && likeUnlike) {
                infoMyStatus = likeUnlike.myStatus
            } else {
                infoMyStatus = LikeStatus.NONE
            }

            let filter = {
                id: item._id!.toString(),
                content: item.content , 
                commentatorInfo: item.commentatorInfo , 
                createdAt: item.createdAt,
                likesInfo: {
                    likesCount: item.likesCount,
                    dislikesCount: item.dislikesCount, 
                    myStatus:  infoMyStatus
                }
            }
            return filter
        }))

        let result: PaginatorCommentViewModel = {
            pagesCount: Math.ceil(commentsInfoDb.totalCaunt/filter.pageSize!), // сколько всего страниц
            page: filter.pageNumber!, // какая страница
            pageSize: filter.pageSize!,
            totalCount: commentsInfoDb.totalCaunt,
            items: mapedDocument,

        };

        return result;

    }

}















