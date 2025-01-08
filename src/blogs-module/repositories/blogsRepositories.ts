import { BlogInputModel, BlogPostInputModel, BlogViewModel } from '../types/dbType';
import {blogsCollection, postsCollection} from '../../db/mongoDb'

export const metodsBlogsDB = {
    async checkId(id: string): Promise<BlogViewModel | null> {
        return await blogsCollection.findOne({id})
    },
    async deleteAll(): Promise<void> {
        await blogsCollection.deleteMany({}) 
    },
    async updateBlog(id: string, updateData: BlogInputModel) {
        return await blogsCollection.updateOne({id},{ $set: {...updateData} })
    }, 
    async createBlog(data: BlogViewModel) {
        return await blogsCollection.insertOne({...data});
    },
    async deleteBlog(id: string) {
        return await blogsCollection.deleteOne({id})
    }
}
