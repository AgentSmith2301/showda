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
    // getPost() {},
    createPost(post: PostInputModel): PostViewModel {
        let id = (Date.now() + Math.random()).toString();
        id.toString();
        // let blogName = 
        return {
            id: id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: 'какое-то имя пока так'// из блога возьми и вставь сюда в место заглушки
        }

    },
    // updatePost() {},
    deletePost(id: string) {
        let result = allDB.posts.findIndex((value) => value.id === id);
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
        allDB.blog.find((value, index) => {
            if(value.id === id) {
                allDB.blog.splice(index, 1);
                return true;
            } else {
                return false;
            }
        });
    }
}

