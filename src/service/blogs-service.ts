import { BlogInputModel, BlogPostInputModel, BlogViewModel, PostViewModel } from '../types/dbType';
import {blogsCollection} from '../db/mongoDb'
import {metodsBlogsDB} from '../repositories/blogsRepositories';
import {getBlogMethods} from '../repositories/blogs-query-repository'
import { metodsPostsDB } from '../repositories/postsRepositories';
import { getPostsMetodsDb } from '../repositories/posts-query-repository'
import { servicePostsMethods } from './posts-service';

export const serviceBlogsMethods = {
    async checkId(id: string): Promise<boolean> {
        const result = await metodsBlogsDB.checkId(id)
        if(result) {
            return true
        } else {
            return false
        }
    },
    async deleteAll(): Promise<void> {
        await blogsCollection.deleteMany({})
        
    },
    async updateBlog(id: string, blog: BlogInputModel) {
        let updateData = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        } 
        const result = await metodsBlogsDB.updateBlog(id, updateData)
        return result.matchedCount === 1
        
    }, 
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
        const result = await metodsBlogsDB.createBlog(data);
        let metodResponse = null;
        if(result.acknowledged === true) {
            metodResponse =  getBlogMethods.getBlog(id)
        } 
        return metodResponse
        
    },
    // новая функция создания поста по id блога
    async createPostForBlogWithId(checkId: string, filter: BlogPostInputModel): Promise<PostViewModel | boolean> { 
        let result ;
        let check = await metodsBlogsDB.checkId(checkId);
        if(!check) {
            result = false
        } else { 
            result = await servicePostsMethods.createPost({...filter, blogId: checkId})
        }
        return result!
    },
    async deleteBlog(id: string) {
        const result = await metodsBlogsDB.deleteBlog(id)
        return result.deletedCount === 1
    }
}
