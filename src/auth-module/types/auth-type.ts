export interface LoginInputModel {
    loginOrEmail: string;
    password: string
}

export interface LoginSuccessViewModel {
    accessToken: string
}

export type PayloadFromToken = { id: string, iat: number, exp: number }

export interface MeViewModel {
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

export interface CookieWithRefreshToken {
    refreshToken: string;
}

export interface Sessions_Info {
    userId: string;
    deviceId: string;
    iat: Date;
    exp: Date;
    deviceName: string;
    ip: string;
}

export interface API_Info {
    IP: string;
    URL: string;
    date: Date;
    body?: any; //TODO удалить после получения данных body
}

