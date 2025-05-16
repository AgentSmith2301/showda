// декларативные файлы нужно вносить в tsconfig.json в свойство files , например:
// {files: ["index.d.ts"]}

declare global {
    namespace Express {
        export interface Request {
            userId: string | null
        }
    }
}

export{};


