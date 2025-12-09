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
    ip: string | undefined;
    refreshToken: string; 
    createdAt: number; 
    expiresAt: number;
    revokedAt:  Date | null;
}

// TODO инфа о сессии (на замену существующему)
// export interface Sessions_Info {
//     _id: string;
//     userId: ObjectId; // ссылка на пользователя
//     deviceId: string; // имя устройства 
//     userAgent: string; 
//     ip: string;  // откуда пользователь вошел
//     refreshToken: string; // рефреш токен 
//     createdAt: string; // время создания 
//     expiresAt: string; // время протухания
//     revokedAt:  string| null // время отзыва токена , если он аннулирован 
// }