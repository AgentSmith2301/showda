import { ObjectId } from "mongodb"

export interface UserInputModel {
    login: string;
    password: string;
    email: string;

} 

export interface UserViewModel {
    id?: string;
    login?: string;
    email?: string;
    createdAt?: string;

} 
//  это промежуточный тип который мы сами написали что бы мы могли заменить _id на id 
export interface UserViewModelDB {
    _id?: ObjectId;
    login?: string;
    email?: string;
    hash: string;
    salt: string;
    createdAt?: string;
    emailConfirmation?: {   
        confirmationCode: string; 
        expirationDate: Date; 
        isConfirmed: boolean;
    }
} 

// кастомный тип для получения query запросов для Users
export type SearchTermUsers = {
    sortBy: string;
    sortDirection: 1 | -1; 
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
}

export interface Paginator<UserViewModel> {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModel[];
}

export interface ConfirmationInfo {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
}

export type CreateUserData = {
    login: string;
    email: string;
    hash: string;
    salt: string;
    createdAt: string;
    emailConfirmation?: ConfirmationInfo;
}

export interface UserByTerm {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModel[];
}

// объект для поиска с свойствами которые есть у юзера , но все значения не обязательны
type SearchUserData = "email" | "login";
export interface SearchObject extends Partial<Record<SearchUserData, string>> {}

// объект для бизнеса с информацией о пользователе
export interface User_info_From_Busines {
    id: string;
    login: string;
    email: string;
    hash: string;
    salt: string;
    createdAt: string;
    emailConfirmation: ConfirmationInfo;
}