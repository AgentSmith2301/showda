import { GetQueryPosts, PaginatorPostViewModel, PostViewModel } from '../types/dbType';
import {postsCollection} from '../db/mongoDb'

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

    async getAllPostsForBlog(id: string, filter: GetQueryPosts) {
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

    }
}