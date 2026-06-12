import mongoose from 'mongoose';
import {SETTINGS} from '../../../settings';
import {LikeModel} from '../model/like-model';
import {LikeDB} from '../../type/like-types';
import {injectable, inject} from 'inversify';

@injectable()
export class LikeReppositories {
    constructor(@inject(SETTINGS.TYPES.likeModel) public likeModel : typeof LikeModel) {}

    async likeOrDislikeCreaterRepositories(userId: string, commentId: string, likeStatus: string): Promise<LikeDB | null> {
        const likeInfo = await this.likeModel.create({commentId: commentId, userId: userId, myStatus: likeStatus});
        return likeInfo.toObject();
    }

    async findLikeInfoRepositories(userId: string, commentId: string): Promise<LikeDB | null> {
        const likeStatus: LikeDB | null = await this.likeModel.findOne({commentId: commentId, userId: userId}).select('-_id -__v').lean();
        return likeStatus
    }

    async chengeLikeStatusRepositories(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        const likeInfo = await this.likeModel.updateOne({commentId: commentId, userId: userId}, {myStatus: likeStatus});
        if(likeInfo.modifiedCount === 1) {
            return true
        } else {
            return false
        }
    }    

    async deleteDocumentRepositories(userId: string, commentId: string): Promise<boolean> {
        const result: mongoose.mongo.DeleteResult = await this.likeModel.deleteOne({commentId: commentId, userId: userId});
        if(result.deletedCount === 1) {
            return true
        } else {
            return false
        }
    }

}


