import {commentsCollection} from '../../db/mongoDb'
import { GetQueryPosts } from '../../posts-module/types/dbType';
import { CommentViewModel, PaginatorCommentViewModel } from '../types/comments-type';
import {ObjectId} from 'mongodb'

export const queryCommentsRepositories = {
    async getCommentByIdRepositories(id: string): Promise<CommentViewModel | null> {
    
        if(!ObjectId.isValid(id)) {
            return null
        } 
        
        let objectId: ObjectId = new ObjectId(id)
        let result = await commentsCollection.findOne({_id: objectId});

        if(result) {
            let maping = {
                id: result!._id.toString() ,
                content: result!.content,
                commentatorInfo: {
                    userId: result!.commentatorInfo.userId,
                    userLogin: result!.commentatorInfo.userLogin
                },
                createdAt: result!.createdAt
            }
            return maping
        } else {
            return null
        }
        
    },

    async getAllComments(postId: string, filter: GetQueryPosts) { 
        // кол-во комментариев к этому посту
        const totalCaunt = await commentsCollection.countDocuments({postId: postId});
        let searchDocument = await commentsCollection.find({postId: postId}, {projection: {postId: 0}})
        .sort([filter.sortBy!, filter.sortDirection!])
        .skip((filter.pageNumber! - 1) * filter.pageSize!)
        .limit(filter.pageSize!)
        .toArray();

        let mapedDocument: CommentViewModel[] = [];
        searchDocument.forEach((item) => {
            let filter = {id: item._id.toString(), content: item.content , commentatorInfo: item.commentatorInfo , createdAt: item.createdAt }
            mapedDocument.push(filter)
        })

        let result: PaginatorCommentViewModel = {
            pagesCount: Math.ceil(totalCaunt/filter.pageSize!), // сколько всего страниц
            page: filter.pageNumber!, // какая страница
            pageSize: filter.pageSize!,
            totalCount: totalCaunt,
            items: mapedDocument
        };

        return result;
    },

}