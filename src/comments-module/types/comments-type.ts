import { ObjectId } from "mongodb"

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


