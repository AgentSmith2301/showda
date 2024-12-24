import { PostInputModel, PostViewModel } from '../types/dbType';
import { metodsBlogsDB } from '../repositories/blogsRepositories';
import { metodsPostsDB } from '../repositories/postsRepositories';

export const servicePostsMethods = {
    async getAll(): Promise<PostViewModel[]> {
        return metodsPostsDB.getAll();
    },
    async getPost(id: string) {
        return await metodsPostsDB.getPost(id)
    },
    async createPost(post: PostInputModel): Promise<PostViewModel | null> {
        let id = Date.now().toString();
        const createdAt = new Date().toISOString();
        let blogName: string;
        const findBlogs = await metodsBlogsDB.getBlog(post.blogId)
        if(findBlogs !== null) {
            blogName = findBlogs.name
            const baseUpdate = {
                id: id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: blogName,
                createdAt, 
            }
            await metodsPostsDB.createPost(baseUpdate)
        } else {
            blogName = 'NOT FIND'
        }
        return metodsPostsDB.getPost(id)
    },
    async updatePost(id: string, body: PostInputModel) {
        const result = await metodsPostsDB.updatePost(id,body)
        return result.matchedCount === 1
    },
    async deletePost(id: string) {
        const result = await metodsPostsDB.deletePost(id)
        return result.deletedCount === 1
    },
    async deleteAll() {
        await metodsPostsDB.deleteAll()
    },
}
