import {Request} from 'express'

export interface LoginInputModel {
    loginOrEmail: string,
    password: string
}

export interface LoginSuccessViewModel {
    accessToken: string
}

export interface MeViewModel {
    email: string,
    login: string,
    userId: string
}

// для расширения типа запроса (так же в место этого можно использовать declare создав файл index.d.ts)
export interface CastomRequest extends Request {userId?: string | null}
// ОПИСАНИЕ КАК ВЫГЛЯДЕЛ БЫ ДЕКЛАРАТИВНЫЙ ФАЙЛ 
//index.d.ts
// declare global {
//     namespace Express {
//         export interface Request {
//             userId: string | null
//         }
//     }
// }
// декларативный файл должен быть подключен к проекту в tsconfig.json
//tsconfig.json
// {
//     "files": ["index.d.ts"] //path (e.g.: "src/types/index.d.ts")
// }
