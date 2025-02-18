import { ObjectId, WithId } from 'mongodb';
import {commentsCollection} from '../../db/mongoDb'
import { CommentPostModel, CommentViewModel } from "../types/comments-type";



export const commentsRepositories = {
    async createComment(data: CommentPostModel): Promise<{acknowledged: boolean, insertedId: ObjectId}> {
        return await commentsCollection.insertOne(data);
    },


}

