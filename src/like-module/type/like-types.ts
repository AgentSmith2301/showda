
export interface LikesInfoViewModel {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
};

export enum LikeStatus {
    LIKE = "LIKE",
    DISLIKE = "DISLIKE",
    NONE = "NONE"
}

export interface LikeInputModel {
    likeStatus: LikeStatus;
}

export interface LikeDB {
    commentId: string;
    userId: string;
    myStatus: LikeStatus;
}






