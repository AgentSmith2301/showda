import { ObjectId } from "mongodb"

export interface UserInputModel {
    login: string,
    password: string,
    email: string
} 

export interface UserViewModel {
    id?: string,
    login?: string,
    email?: string,
    createdAt?: string
} 
//  это промежуточный тип который мы сами написали что бы мы могли заменить _id на id 
export interface UserViewModelDB {
    _id?: ObjectId,
    login?: string,
    email?: string,
    createdAt?: string
} 

// кастомный тип для получения query запросов для Users
export type SearchTermUsers = {
    sortBy: string, 
    sortDirection: 1 | -1, 
    pageNumber: number, 
    pageSize: number, 
    searshLoginTerm: string | null, 
    searchEmailTerm: string | null
}

export interface Paginator<UserViewModel> {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}


