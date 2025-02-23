import { GetQueryPosts, PaginatorPostViewModel, PostViewModel } from '../types/dbType';
import {postsCollection} from '../../db/mongoDb'
import { getAllCommentsByPostId } from '../controllers/postsControllers';
import { queryCommentsRepositories } from '../../comments-module/repositories/comments-query-repository';

const projection = {
    _id: 0, 
    title: 1, 
    id: 1, 
    blogName: 1, 
    shortDescription: 1, 
    content: 1, 
    blogId: 1,
    createdAt: 1,
}

export const getPostsMetodsDb = {
    async getAll(filter: GetQueryPosts): Promise<PaginatorPostViewModel> { 
        const totalCaunt = await postsCollection.countDocuments({});
        let searchItems = await postsCollection
        .find({}, { projection: projection })
        .sort([filter.sortBy!, filter.sortDirection!])
        .skip((filter.pageNumber! - 1) * filter.pageSize!)
        .limit(filter.pageSize!)
        .toArray();

        let result: PaginatorPostViewModel = {
            pagesCount: Math.ceil(totalCaunt/filter.pageSize!), // сколько всего страниц
            page: filter.pageNumber!, // какая страница
            pageSize: filter.pageSize!,
            totalCount: totalCaunt,
            items: searchItems
        };
        return result;

    },
    async getPost(id: string) {
        return await postsCollection.findOne({id}, { projection: projection })
    },

    async getAllPostsForBlog(id: string, filter: GetQueryPosts): Promise<PaginatorPostViewModel> {
        let searchItems = await postsCollection.find({blogId:id}, { projection: projection })
        .sort([filter.sortBy!, filter.sortDirection!])
        .skip((filter.pageNumber! - 1) * filter.pageSize!)
        .limit(filter.pageSize!)
        .toArray();

        const totalCaunt = await postsCollection.countDocuments({blogId:id});

        let result: PaginatorPostViewModel = {
            pagesCount: Math.ceil(totalCaunt/filter.pageSize!), // сколько всего страниц
            page: filter.pageNumber!, // какая страница
            pageSize: filter.pageSize!,
            totalCount: totalCaunt,
            items: searchItems
        };
        return result;
    },

    async getAllCommentsByPostId(postId: string, filter: GetQueryPosts) {
        const result = await queryCommentsRepositories.getAllComments(postId, filter)
        return result;
    }

}