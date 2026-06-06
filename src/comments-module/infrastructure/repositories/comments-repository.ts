import { CommentPostModel, incrementLikeCountForComment } from "../../types/comments-type";
import mongoose from 'mongoose';
import { SETTINGS } from '../../../settings';
import { Comments } from '../model/comments-model';
import { injectable, inject } from 'inversify';

@injectable()
export class CommentsRepositories {
    
    constructor(@inject(SETTINGS.TYPES.commentsModel) public commentsModel: typeof Comments) {}

    async deleteAll() {
        await this.commentsModel.deleteMany({})
    }

    async createComment(data: CommentPostModel): Promise<CommentPostModel | null> {
        // TODO нужен глобальный обработчик ошибок , чтообы не писать try catch в каждом методе репозитория
        const result: mongoose.HydratedDocument<CommentPostModel> = await this.commentsModel.create(data);
        // если есть данные то возвращаем если нет то нужно вернуть null и обработать в сервисе , а так же изменить 
        // возвращаемые значения

        if(result) {
            return result.toObject();
        } else {
            return null
        }

    }

    async deleteCommentByIdRepository(id: string): Promise<{acknowledged:boolean, deletedCount: number}> {
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return { acknowledged: false, deletedCount: 0 }
        }
        const objectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id)
        return await this.commentsModel.deleteOne({_id: objectId})
    }

    async updateComment(id: string, content: string) {
        const objectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
        return await this.commentsModel.updateOne({_id: objectId}, {$set: {content: content}})
    }

    async incrementLikeCount(id: string, likeStatus: incrementLikeCountForComment): Promise<boolean> {
        const objectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
        const serchFild: string[] = Object.keys(likeStatus);
        const firsFild: string = serchFild[0];
        const data = await this.commentsModel.updateOne({_id: objectId}, {$inc: likeStatus})        
        if(data.modifiedCount === 1 || data.acknowledged === true) {
            return true
        } else {
            return false
        }
    }

    async chengeLikeAndDislikeCount(id: string, likeStatus: incrementLikeCountForComment) {
        const objectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
        const serchFild: string[] = Object.keys(likeStatus);
        const firsFild: string = serchFild[0];
        const lastFild: string = serchFild[1];
        const data = await this.commentsModel.updateOne({_id: objectId, [firsFild] : { $gte: 0 }, [lastFild] : { $gte: 0 }}, {$inc: likeStatus})        
        if(data.modifiedCount === 1 || data.acknowledged === true) {
            return true
        } else {
            return false
        }
    }

}

