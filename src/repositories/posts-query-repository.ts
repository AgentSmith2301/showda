import { PostViewModel } from '../types/dbType';
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

export const getPostsMetodsDb = {
    async getAll(): Promise<PostViewModel[]> {
        return await postsCollection.find({}, { projection: projection }).toArray();
    },
    async getPost(id: string) {
        return await postsCollection.findOne({id}, { projection: projection })
    }
}