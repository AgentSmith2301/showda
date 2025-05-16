import { ResultStatus } from "./resultStatus-enum";

interface ExtensionType {
    field: string | null;
    message: string;
}

export type Result<T = null> = {
    status: ResultStatus;
    errorsMessages: string;
    extensions: ExtensionType [];
    data: T;
}