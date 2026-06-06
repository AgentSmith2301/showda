import mongoose from 'mongoose';
import {GetQueryPosts} from '../../../posts-module/types/dbType';
import {CommentPostModel, CommentViewModel, PaginatorCommentViewModel } from '../../types/comments-type';
import {Comments} from '../model/comments-model';
import { injectable, inject } from "inversify";
import { SETTINGS } from '../../../settings';
import { LikeStatus } from '../../../like-module/type/like-types';

@injectable()
export class QueryCommentsRepositories {
    
    constructor(@inject(SETTINGS.TYPES.commentsModel) public commentsModel: typeof Comments) {}

    async getCommentByIdRepositories(id: string): Promise<CommentPostModel | null> {
    
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return null
        } 
        
        let objectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id)
        let result = await this.commentsModel.findOne({_id: objectId});

        if(result) {
            return result.toObject();
        } else {
            return null
        }
        
    }

    async getAllComments(postId: string, filter: GetQueryPosts): Promise<PaginatorCommentViewModel> { 
        // кол-во комментариев к этому посту
        const totalCaunt = await this.commentsModel.countDocuments({postId: postId});
        let searchDocument = await this.commentsModel.find({postId: postId}, {projection: {postId: 0}})
        .sort([[filter.sortBy!, filter.sortDirection!]])
        .skip((filter.pageNumber! - 1) * filter.pageSize!)
        .limit(filter.pageSize!);

        let mapedDocument: CommentViewModel[] = [];
        searchDocument.forEach((item) => {
            let filter = {
                id: item._id.toString(),
                content: item.content , 
                commentatorInfo: item.commentatorInfo , 
                createdAt: item.createdAt,
                likesInfo: {
                    likesCount: item.likesCount,
                    dislikesCount: item.dislikesCount, 
                    myStatus: LikeStatus.NONE // заглушка 
                }
            }
            mapedDocument.push(filter)
        })

        let result: PaginatorCommentViewModel = {
            pagesCount: Math.ceil(totalCaunt/filter.pageSize!), // сколько всего страниц
            page: filter.pageNumber!, // какая страница
            pageSize: filter.pageSize!,
            totalCount: totalCaunt,
            items: mapedDocument,

        };

        return result;
    }

}