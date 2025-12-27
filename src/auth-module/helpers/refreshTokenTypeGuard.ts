import { CookieWithRefreshToken, Refresh_Session_Token } from "../types/auth-type";


export function cookiesGuard(token: any): token is CookieWithRefreshToken {
    return typeof token.refreshToken === 'string'
}
// альтернативный вариант
// export function cookiesGuard(token: unknown): token is CookieWithRefreshToken {
//     return (typeof token ===  'object' && token !== null && 'refreshToken' in token && typeof (token as any).refreshToken === 'string')   
// }

export function refreshTokenGuard(payload: any): payload is Refresh_Session_Token {
    return typeof payload.userId === 'string'
}