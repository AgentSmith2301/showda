import { LikeStatus } from "../../type/like-types";

export const likeForSchema = {
    commentId: {type: String, required: true},
    userId: {type: String, required: true},
    myStatus: {
        type: String, 
        required: true,
        enum: Object.values(LikeStatus)
    }
}


