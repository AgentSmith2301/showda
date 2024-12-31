export interface PostViewModel {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
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
    createdAt: string,
    isMembership: boolean,
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

// пагинация
export interface PaginatorBlogViewModel {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[]
}

export interface PaginatorPostViewModel {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostViewModel[]
}

export interface BlogPostInputModel {
    title: string,
    shortDescription: string,
    content: string
}

// тип объекта запроса гет для blogs 
export interface GetQueryBlogs {
    searchNameTerm?: string ,  // поиск по полю name
    sortBy?: string,          
    sortDirection?: 1 | -1 ,   
    pageNumber?: number,
    pageSize?: number
}

// тип объекта запроса гет для posts
export interface GetQueryPosts {
    pageNumber?: number,
    pageSize?: number
    sortBy?: string,          
    sortDirection?: 1 | -1 ,   
}