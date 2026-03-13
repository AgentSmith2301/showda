import { BlogInputModel, BlogViewModel } from '../types/dbType';
import {blogsCollection} from '../../db/mongoDb'
import {injectable, inject } from 'inversify'; 

@injectable() // помечаем класс как injectable, чтобы его можно было внедрить в другие классы
export class BlogsRepositories {
    
    async checkId(id: string): Promise<BlogViewModel | null> {
        return await blogsCollection.findOne({id})
    }
    async deleteAll(): Promise<void> {
        await blogsCollection.deleteMany({}) 
    }
    async updateBlog(id: string, updateData: BlogInputModel) {
        return await blogsCollection.updateOne({id},{ $set: {...updateData} })
    }
    async createBlog(data: BlogViewModel) {
        return await blogsCollection.insertOne({...data});
    }
    async deleteBlog(id: string) {
        return await blogsCollection.deleteOne({id})
    }
}