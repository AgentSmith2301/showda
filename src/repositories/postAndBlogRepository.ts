interface PostViewModel {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
}

interface PostInputModel {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

interface BlogViewModel {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}

interface BlogInputModel {
    name: string,
    description: string,
    websiteUrl: string,
}

type ErrorResult = FieldError[];

interface FieldError {
    message: string,
    field: string,
}

// Типы в базе 
interface DBType {
    posts: PostViewModel[];
    blog: BlogViewModel[];
}
// база postsDB { post: [ PostViewModel ] }
const allDB: DBType = {
    posts: [],
    blog: [],
}

export const metodsPostsDB = {
    getAll() {
        return allDB.posts;
    },
    getPost(id: string) {
        const result = allDB.posts.find((value) => value.id === id );
        return result;
    },
    createPost(post: PostInputModel): PostViewModel {
        let id = Date.now().toString();;
        let blogNotUndefined = metodsBlogsDB.getBlog(post.blogId);
        let result: string;
        if(blogNotUndefined !== undefined) {
            result = blogNotUndefined.name;
        } else {
            result = 'NOT FIND'
        }
        const baseUpdate = {
            id: id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: result 
        }
        allDB.posts.push(baseUpdate)
        return baseUpdate
    },
    updatePost(id: string, body: PostInputModel) {
        const searchFromBase = allDB.posts.findIndex((value) => value.id === id);
        if(searchFromBase >= 0) {
            let result = allDB.posts.filter((value, index) => searchFromBase === index)
            allDB.posts.splice(searchFromBase,1, {...result[0], ...body})
            return true;
        } else {
            return false;
        }
    },
    deletePost(id: string) {
        let result = allDB.posts.findIndex((value) => value.id === id);
        allDB.posts.splice(result,1)
        return result;
    },
    deleteAll() {
        allDB.posts = [];
    },
}

export const metodsBlogsDB = {
    checkId(id: string) {
        const result = allDB.blog.find((value) => value.id === id);
        if(result) {
            return true
        } else {
            return false
        }
    },
    getAll() {
        return allDB.blog;
    },
    deleteAll() {
        allDB.blog = [];
    },
    getBlog(id: string) {
        const result = allDB.blog.find((value) => value.id === id);
        return result;
    },
    updateBlog(id: string, blog: BlogInputModel) {
        let findElement = allDB.blog.find((value) => value.id === id);
        if(findElement !== undefined) {
            findElement.name = blog.name;
            findElement.description = blog.description;
            findElement.websiteUrl = blog.websiteUrl;
            return true
        } else {
            return false
        }
        
    }, 
    createBlog(blog: BlogInputModel): BlogViewModel {
        const id = Date.now().toString();
        const essence = {
            id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }
        allDB.blog.push(essence)
        return essence;
    },
    deleteBlog(id: string) {
        let result = allDB.blog.findIndex((value) => value.id === id);
        console.log(result, 'result')
        if(result > -1) {
            allDB.blog.splice(result, 1)
            return true
        } else {
            return false
        }

    }
}

