import { PostInputModel, PostViewModel } from '../types/dbType';
import {postsCollection} from '../../db/mongoDb'

export const metodsPostsDB = {
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
