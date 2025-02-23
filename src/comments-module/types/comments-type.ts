import { ObjectId } from "mongodb"
import {Request} from 'express'

export interface CommentInputModel {
    content: string
}

interface CommentatorInfo {
    userId: string,
    userLogin: string
}

export interface CommentViewModel {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo ,
    createdAt: string
}

export interface CommentPostModel {
    _id?: ObjectId, 
    postId: string,
    content: string,
    commentatorInfo: CommentatorInfo ,
    createdAt: string
}

export interface PaginatorCommentViewModel {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentViewModel[]
}

// для расширения типа запроса (так же в место этого можно использовать declare создав файл index.d.ts)
// export interface CastomRequest extends Request {userId: string | null}


