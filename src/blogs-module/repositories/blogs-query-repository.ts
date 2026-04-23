import { BlogInputModel, BlogViewModel, GetQueryBlogs, PaginatorBlogViewModel } from '../types/dbType';
import {Blogs} from '../infrastructure/model/blogs-model';
import {GetPostsMetodsDb} from '../../posts-module/repositories/posts-query-repository';
import {injectable, inject} from 'inversify';
import {SETTINGS} from '../../settings'

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

@injectable()
export class GetBlogMethods {

    constructor(public getPostsMetodsDb: GetPostsMetodsDb,  @inject(SETTINGS.TYPES.blogsModel) public blogModel : typeof Blogs) {}

    async getAll(query: GetQueryBlogs ):Promise<PaginatorBlogViewModel> {
        let generateQuery: any = {};
        if(query.searchNameTerm)  generateQuery.name = { $regex: query.searchNameTerm, $options: 'i' }
        let sort: string = query.sortBy!.toString();
        let sortDirection = query.sortDirection!;

        // кол-во документов по фильтру
        const totalCount = await Blogs.countDocuments(generateQuery);

        let filter = await Blogs.find(generateQuery)
            .select(projection)
            .sort({[sort]: sortDirection})
            .skip((query.pageNumber! - 1) * query.pageSize!)
            .limit(query.pageSize!)

        let responseObject: PaginatorBlogViewModel = {
            pagesCount: Math.ceil(totalCount / query.pageSize!),  // кол-во страниц 
            page: query.pageNumber!,      // страница
            pageSize: query.pageSize!,  // элементов на странице
            totalCount, // всего документов
            items: filter
        };

        return responseObject
    }

    async getBlog(id: string): Promise<BlogViewModel | null> {
        return await this.blogModel.findOne({id}).select(projection)
    }

    async getAllPostsFromBlogId(blogId: string, filter: any) {
        let result = await this.getPostsMetodsDb.getAllPostsForBlog(blogId, filter);
        return result;
    }
}

