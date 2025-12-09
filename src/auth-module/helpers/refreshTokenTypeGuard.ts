import { CookieWithRefreshToken } from "../types/auth-type";


export function cookiesGuard(toket: any): toket is CookieWithRefreshToken {
    return typeof toket.refreshToken === 'string'
}

// export function cookiesGuard(token: unknown): token is CookieWithRefreshToken {
//     return (typeof token ===  'object' && token !== null && 'refreshToken' in token && typeof (token as any).refreshToken === 'string')   
// }