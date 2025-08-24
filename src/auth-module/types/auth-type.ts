export interface LoginInputModel {
    loginOrEmail: string;
    loginOrEmail: string;
    password: string
}

export interface LoginSuccessViewModel {
    accessToken: string
}

export interface MeViewModel {
    email: string;
    login: string;
    email: string;
    login: string;
    userId: string
}

interface FieldError {
    message: string;
    field: string;
}

export interface APIErrorResult {
    errorsMessages: FieldError[]
}

export interface MailInfo {
    accepted: (string | {name: string; adress?: string;})[];
    rejected: (string | {name: string; adress?: string;}) [];
    response: string;
}

