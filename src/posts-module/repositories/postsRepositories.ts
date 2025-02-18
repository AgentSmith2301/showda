import { PostInputModel, PostViewModel } from '../types/dbType';
import {postsCollection, commentsCollection} from '../../db/mongoDb'
import { CommentPostModel, CommentViewModel } from '../../comments-module/types/comments-type';


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
