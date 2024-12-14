import { PostInputModel, PostViewModel, allDB } from '../types/dbType';
import { metodsBlogsDB } from './blogsRepositories';


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
