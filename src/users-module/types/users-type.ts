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
//  это промежуточный тип который мы сами написали что бы мы могли использовать _id
export interface UserViewModelDB {
    _id?: string,
    login?: string,
    email?: string,
    createdAt?: string
} 

export interface Paginator<UserViewModel> {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}


