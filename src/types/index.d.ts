// декларативные файлы нужно вносить в tsconfig.json в свойство files , например:
// {files: ["index.d.ts"]}
import {Refresh_Session_Token} from '../auth-module/types/auth-type'


declare global {
    namespace Express {
        export interface Request {
            userId: string | null;
            tokenPayload: Refresh_Session_Token | undefined
        }
    }
}

export{}; // обязателено что бы файл был модулем
