import { BlogInputModel, BlogViewModel, allDB } from '../types/dbType';
import {blogsCollection} from '../db/mongoDb'

export const metodsBlogsDB = {
    async checkId(id: string): Promise<boolean> {
        const result = await blogsCollection.findOne({id})

        if(result) {
            return true
        } else {
            return false
        }
    },
    async getAll() {
        const result = await blogsCollection.find({}, {
            projection: {
                _id: 0, description: 1,
                id: 1, 
                name: 1, 
                websiteUrl: 1,
                createdAt: 1,
                isMembership: 1,
            }}).toArray();
        return result

    },
    async deleteAll() {
        const result = await blogsCollection.deleteMany({})
        
    },
    async getBlog(id: string) {
        const result = await blogsCollection.findOne({id},{
            projection: {
                _id: 0, 
                description: 1, 
                id: 1, 
                name: 1, 
                websiteUrl: 1,
                createdAt: 1,
                isMembership: 1,
            }})
        return result;
    },
    async updateBlog(id: string, blog: BlogInputModel) {

        const result = await blogsCollection.updateMany({id},[
            {$set: {name: blog.name}}, 
            {$set: {description: blog.description}},
            {$set: {websiteUrl: blog.websiteUrl}}
        ])
        return result.matchedCount === 1
        
    }, 
    async createBlog(blog: BlogInputModel): Promise<BlogViewModel | null> {
        const id = Date.now().toString();
        const createdAt = new Date().toISOString();
        const result = await blogsCollection.insertOne({
            id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt,
            isMembership: false,
        });

        let metodResponse = null;

        if(result.acknowledged === true) {
            metodResponse =  metodsBlogsDB.getBlog(id)
        } 
        return metodResponse
        
    },
    async deleteBlog(id: string) {
        const result = await blogsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}
