import { BlogInputModel, BlogViewModel, GetQueryBlogs, PaginatorBlogViewModel, PaginatorPostViewModel } from '../types/dbType';
import {blogsCollection} from '../db/mongoDb'

// фильтр для возвращаемых свойтв
const projection = {
    _id: 0, 
    description: 1,
    id: 1, 
    name: 1, 
    websiteUrl: 1,
    createdAt: 1,
    isMembership: 1,
}

export const getBlogMethods = {

    async getAll(query: GetQueryBlogs ):Promise<PaginatorBlogViewModel> {
        let generateQuery: any = {};
        if(query.searchNameTerm)  generateQuery.name = { $regex: query.searchNameTerm, $options: 'i' }
        let sort: string = query.sortBy!.toString();
        let sortDirection = query.sortDirection!;

        // кол-во документов по фильтру
        const totalCount = await blogsCollection.countDocuments(generateQuery)
        const filter = await blogsCollection
            .find(generateQuery, { projection: projection })
            .sort([sort, sortDirection])
            .skip((query.pageNumber! - 1) * query.pageSize!)
            .limit(query.pageSize!)
            .toArray();

        let responseObject: PaginatorBlogViewModel = {
            pagesCount: Math.ceil(totalCount / query.pageSize!),  // кол-во страниц 
            page: query.pageNumber!,      // страница
            pageSize: query.pageSize!,  // элементов на странице
            totalCount, // всего документов
            items: filter 
        };

        return responseObject
    },

    async getBlog(id: string): Promise<BlogViewModel | null> {
        return await blogsCollection.findOne({ id },{ projection: projection })
    },

}