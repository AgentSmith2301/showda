import { PostInputModel, PostViewModel } from '../types/dbType';
import { getBlogMethods } from '../repositories/blogs-query-repository';
import { metodsPostsDB } from '../repositories/postsRepositories';
import { getPostsMetodsDb } from '../repositories/posts-query-repository'

export const servicePostsMethods = {
    async createPost(post: PostInputModel): Promise<PostViewModel | null> {
        let id = Date.now().toString();
        const createdAt = new Date().toISOString();
        let blogName: string;
        const findBlogs = await getBlogMethods.getBlog(post.blogId)
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
        return getPostsMetodsDb.getPost(id)
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
