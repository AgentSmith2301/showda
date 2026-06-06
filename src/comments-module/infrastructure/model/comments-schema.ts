export const comments_Schema = {
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    likesCount: {type: Number, default: 0, required: true},
    dislikesCount: {type: Number, default: 0, required: true}
}














