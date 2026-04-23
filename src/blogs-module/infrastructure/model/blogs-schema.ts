
export const blogsForSchema = {
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    websiteUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    isMembership: {
        type: Boolean,
        required: true,
        default: false
    }
}






