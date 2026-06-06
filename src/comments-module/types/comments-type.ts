import { ObjectId } from "mongodb"
import { LikesInfoViewModel } from "../../like-module/type/like-types";
import {Request} from 'express'

export interface CommentInputModel {
    content: string
}

interface CommentatorInfo {
    userId: string;
    userLogin: string;
}

export interface CommentViewModel {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo ;
    createdAt: string;
    likesInfo?: LikesInfoViewModel;
}

export interface CommentPostModel {
    _id?: ObjectId;
    postId: string;
    content: string;
    commentatorInfo: CommentatorInfo ;
    createdAt: string;
    likesCount: number;
    dislikesCount: number;
}

export interface PaginatorCommentViewModel {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModel[]
}

export interface incrementLikeCountForComment {
    dislikesCount?: number;
    likesCount?: number;
}

// для расширения типа запроса (так же в место этого можно использовать declare создав файл index.d.ts)
// export interface CastomRequest extends Request {userId: string | null}



