import { BlogInputModel, BlogViewModel } from '../types/dbType';
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
    // async checkId(id: string): Promise<BlogViewModel | null> {
    //     return await blogsCollection.findOne({id})
    // },
    async getAll():Promise<BlogViewModel[]> {
        return await blogsCollection.find({}, { projection: projection }).toArray();
    },
    async getBlog(id: string): Promise<BlogViewModel | null> {
        return await blogsCollection.findOne({ id },{ projection: projection })
    },

}