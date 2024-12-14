export interface PostViewModel {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
}

export interface PostInputModel {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export interface BlogViewModel {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}

export interface BlogInputModel {
    name: string,
    description: string,
    websiteUrl: string,
}

type ErrorResult = FieldError[];

interface FieldError {
    message: string,
    field: string,
}

// Типы в базе 
interface DBType {
    posts: PostViewModel[];
    blog: BlogViewModel[];
}
// база postsDB { post: [ PostViewModel ] }
export const allDB: DBType = {
    posts: [],
    blog: [],
}

