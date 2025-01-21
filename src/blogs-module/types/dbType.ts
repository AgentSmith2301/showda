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

// пагинация
export interface PaginatorBlogViewModel {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[]
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


