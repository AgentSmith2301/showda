import {LikeReppositories} from '../infrastructure/repositories/like-repositories'
import {inject, injectable}  from 'inversify';
import { LikeDB } from '../type/like-types';

@injectable()
export class LikeService {
    constructor(
        @inject(LikeReppositories) public likeRepositories: LikeReppositories
    ) {}

    async likeOrDislikeCreaterService(userId: string, commentId: string, likeStatus: string = 'None'): Promise<LikeDB | null> {
        return await this.likeRepositories.likeOrDislikeCreaterRepositories(userId, commentId, likeStatus);
        
    }

    async findLikeInfoService(userId: string, commentId: string): Promise<LikeDB | null> {
        return await this.likeRepositories.findLikeInfoRepositories(userId, commentId);
    }

    async chengeLikeStatusService(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        return await this.likeRepositories.chengeLikeStatusRepositories(userId, commentId, likeStatus);
    }

    async deleteDocumentService(userId: string, commentId: string): Promise<boolean> {
        return await this.likeRepositories.deleteDocumentRepositories(userId, commentId)
    }

}











