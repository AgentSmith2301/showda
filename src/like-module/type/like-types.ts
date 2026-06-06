
export interface LikesInfoViewModel {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
};

export enum LikeStatus {
    LIKE = "Like",
    DISLIKE = "Dislike",
    NONE = "None"
}

export interface LikeInputModel {
    likeStatus: LikeStatus;
}

export interface LikeDB {
    commentId: string;
    userId: string;
    myStatus: LikeStatus;
}






