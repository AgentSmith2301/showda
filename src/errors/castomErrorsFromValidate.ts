type fieldError = { // errorsMessages
    message: string, 
    field: string
}

type APIErrorResult = { // errorsMessagesType
    errorsMessages: fieldError[];
};

export const errorFromBlogsAndPosts: APIErrorResult = {
    errorsMessages: [],
}


