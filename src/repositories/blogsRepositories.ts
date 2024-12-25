import { BlogInputModel, BlogViewModel } from '../types/dbType';
import {blogsCollection} from '../db/mongoDb'

// фильтр для возвращаемых свойтв
// const projection = {
//     _id: 0, 
//     description: 1,
//     id: 1, 
//     name: 1, 
//     websiteUrl: 1,
//     createdAt: 1,
//     isMembership: 1,
// }

export const metodsBlogsDB = {
    async checkId(id: string): Promise<BlogViewModel | null> {
        return await blogsCollection.findOne({id})
    },
    // async getAll():Promise<BlogViewModel[]> {
    //     return await blogsCollection.find({}, { projection: projection }).toArray();
    // },
    async deleteAll(): Promise<void> {
        await blogsCollection.deleteMany({}) 
    },
    // async getBlog(id: string): Promise<BlogViewModel | null> {
    //     return await blogsCollection.findOne({ id },{ projection: projection })
    // },
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
