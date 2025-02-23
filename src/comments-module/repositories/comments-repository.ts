import { ObjectId, WithId } from 'mongodb';
import {commentsCollection} from '../../db/mongoDb'
import { CommentPostModel, CommentViewModel } from "../types/comments-type";


export const commentsRepositories = {
    async deleteAll() {
        await commentsCollection.deleteMany({})
    },
    
    async createComment(data: CommentPostModel): Promise<{acknowledged: boolean, insertedId: ObjectId}> {
        return await commentsCollection.insertOne(data);
    },

    async deleteCommentByIdRepository(id: string): Promise<{acknowledged:boolean, deletedCount: number}> {
        if(!ObjectId.isValid(id)) {
            return { acknowledged: false, deletedCount: 0 }
        }
        const objectId: ObjectId = new ObjectId(id)
        return await commentsCollection.deleteOne({_id: objectId})
    },

    async updateComment(id: string, content: string) {
        const objectId: ObjectId = new ObjectId(id);
        return await commentsCollection.updateOne({_id: objectId}, {$set: {content: content}})
    }


}

