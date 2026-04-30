import { GetQueryPosts, PaginatorPostViewModel, PostViewModel } from '../../types/dbType';
// import {postsCollection} from '../../../db/mongoDb'
import { PostsControllerststs } from '../../controllers/postsControllers';
import {Posts} from '../model/posts-module';
import { QueryCommentsRepositories } from '../../../comments-module/repositories/comments-query-repository';
import {injectable, inject } from 'inversify';

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

@injectable()
export class GetPostsMetodsDb {
    
    constructor(public queryCommentsRepositories: QueryCommentsRepositories) {}
    
    async getAll(filter: GetQueryPosts): Promise<PaginatorPostViewModel> { 
        const totalCaunt: number = await Posts.countDocuments({});
        let searchItems = await Posts
        .find({})
        .select(projection)
        .sort([[filter.sortBy!, filter.sortDirection!]])
        .skip((filter.pageNumber! - 1) * filter.pageSize!)
        .limit(filter.pageSize!)

        let result: PaginatorPostViewModel = {
            pagesCount: Math.ceil(totalCaunt/filter.pageSize!), // сколько всего страниц
            page: filter.pageNumber!, // какая страница
            pageSize: filter.pageSize!,
            totalCount: totalCaunt,
            items: searchItems
        };
        return result;

    }

    async getPost(id: string) {
        return await Posts.findOne({id}).select(projection).lean();
    }

    async getAllPostsForBlog(id: string, filter: GetQueryPosts): Promise<PaginatorPostViewModel> {
        let searchItems = await Posts.find({blogId:id})
        .select(projection)
        .sort([[filter.sortBy!, filter.sortDirection!]])
        .skip((filter.pageNumber! - 1) * filter.pageSize!)
        .limit(filter.pageSize!)
        .lean();

        const totalCaunt: number = await Posts.countDocuments({blogId:id});

        let result: PaginatorPostViewModel = {
            pagesCount: Math.ceil(totalCaunt/filter.pageSize!), // сколько всего страниц
            page: filter.pageNumber!, // какая страница
            pageSize: filter.pageSize!,
            totalCount: totalCaunt,
            items: searchItems
        };
        return result;
    }

    async getAllCommentsByPostId(postId: string, filter: GetQueryPosts) {
        return await this.queryCommentsRepositories.getAllComments(postId, filter);
    }

}