import { BlogInputModel, BlogPostInputModel, BlogViewModel } from '../types/dbType';
import { PostViewModel } from '../../posts-module/types/dbType';
import {blogsCollection} from '../../db/mongoDb'
import {BlogsRepositories} from '../repositories/blogsRepositories';
import {GetBlogMethods} from '../repositories/blogs-query-repository'
// import { servicePostsMethods } from '../../posts-module/service/posts-service';
import {injectable, inject } from 'inversify';  
import { ServicePostsMethods } from '../../posts-module/service/posts-service';

@injectable() // помечаем класс как injectable, чтобы его можно было внедрить в другие классы
export class BlogsService {
    
    constructor(
        @inject(BlogsRepositories) public blogsRepositories: BlogsRepositories,
        @inject(ServicePostsMethods) public servicePostsMethods: ServicePostsMethods,
        @inject(GetBlogMethods) public getBlogMethods: GetBlogMethods
    ) {}

    async checkId(id: string): Promise<boolean> {
        const result = await this.blogsRepositories.checkId(id)
        if(result) {
            return true
        } else {
            return false
        }
    }

    async deleteAll(): Promise<void> {
        await blogsCollection.deleteMany({})
        
    }

    async updateBlog(id: string, blog: BlogInputModel) {
        let updateData = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        } 
        const result = await this.blogsRepositories.updateBlog(id, updateData)
        return result.matchedCount === 1
        
    }

    async createBlog(blog: BlogInputModel): Promise<BlogViewModel | null> {
        const id = Date.now().toString();
        const createdAt = new Date().toISOString();
        const data = {
            id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt,
            isMembership: false,
        }
        const result = await this.blogsRepositories.createBlog(data);
        let metodResponse = null;
        if(result.acknowledged === true) {
            metodResponse =  this.getBlogMethods.getBlog(id)
        } 
        return metodResponse
        
    }

    // новая функция создания поста по id блога
    async createPostForBlogWithId(checkId: string, filter: BlogPostInputModel): Promise<PostViewModel | boolean> { 
        let result ;
        let check = await this.blogsRepositories.checkId(checkId);
        if(!check) {
            result = false
        } else { 
            result = await this.servicePostsMethods.createPost({...filter, blogId: checkId})
        }
        return result!
    }

    async deleteBlog(id: string) {
        const result = await this.blogsRepositories.deleteBlog(id)
        return result.deletedCount === 1
    }
}
