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
        console.log(filter, ' <== filter') // TODO delete this stroke "filter"
        
        const totalCaunt = await postsCollection.countDocuments({});
        
        let searchItems = await postsCollection
        .find({}, { projection: projection })
        .sort([filter.sortBy!, filter.sortDirection!])
        .toArray();

        let result: PaginatorPostViewModel = {
            pagesCount: Math.ceil(totalCaunt/filter.pageSize!), // сколько всего страниц
            page: filter.pageNumber!, // какая страница
            pageSize: filter.pageSize!,
            totalCount: totalCaunt,
            items: searchItems
        };

        console.log(result, " <== result posts requst") // TODO delete this stroke 'result request'
        return result;

    },
    async getPost(id: string) {
        return await postsCollection.findOne({id}, { projection: projection })
    }
}