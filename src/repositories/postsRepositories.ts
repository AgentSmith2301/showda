import { PostInputModel, PostViewModel } from '../types/dbType';
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

export const metodsPostsDB = {
    async getAll(): Promise<PostViewModel[]> {
        return await postsCollection.find({}, { projection: projection }).toArray();
    },
    async getPost(id: string) {
        return await postsCollection.findOne({id}, { projection: projection })
    },
    async createPost(post: PostViewModel): Promise<void> {
        await postsCollection.insertOne(post)
    },
    async updatePost(id: string, body: PostInputModel) {
        const result = await postsCollection.updateOne({id},{$set:{...body}})
        return result
    },
    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({id})
        return result
    },
    async deleteAll() {
        await postsCollection.deleteMany({})
    },
}
