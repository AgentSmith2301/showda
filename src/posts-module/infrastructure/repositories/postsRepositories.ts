import { PostInputModel, PostViewModel } from '../../types/dbType';
import {commentsCollection} from '../../../db/mongoDb' // postsCollection
import {Posts} from '../model/posts-module';
import { CommentPostModel, CommentViewModel } from '../../../comments-module/types/comments-type';
import { injectable } from 'inversify';


@injectable()
export class MetodsPostsDB {
    async createPost(post: PostViewModel): Promise<void> {
        await Posts.create(post)
    }
    async updatePost(id: string, body: PostInputModel) {
        const result = await Posts.updateOne({id},{$set:{...body}})
        return result
    }
    async deletePost(id: string) {
        const result = await Posts.deleteOne({id})
        return result
    }
    async deleteAll() {
        await Posts.deleteMany({})
    }

}


