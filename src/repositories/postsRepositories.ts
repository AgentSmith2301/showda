import { PostInputModel, PostViewModel, allDB } from '../types/dbType';
import { metodsBlogsDB } from './blogsRepositories';
import {postsCollection, blogsCollection} from '../db/mongoDb'

export const metodsPostsDB = {
    async getAll(): Promise<PostViewModel[]> {
        const result = await postsCollection.find({}, {
            projection: {
                _id: 0, 
                title: 1, 
                id: 1, 
                blogName: 1, 
                shortDescription: 1, 
                content: 1, 
                blogId: 1,
                createdAt: 1,
            }
        }).toArray();
        return result
    },
    async getPost(id: string) {
        const result = await postsCollection.findOne({id}, {
            projection: {
                _id: 0, 
                title: 1, 
                id: 1, 
                blogName: 1, 
                shortDescription: 1, 
                content: 1, 
                blogId: 1,
                createdAt: 1,
            }
        })
        return result;
    },
    async createPost(post: PostInputModel): Promise<PostViewModel | null> {
        let id = Date.now().toString();
        const createdAt = new Date().toISOString();

        let blogName: string;
        const findBlogs = await blogsCollection.findOne({id:post.blogId})
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
            await postsCollection.insertOne(baseUpdate)
        } else {
            blogName = 'NOT FIND'
        }
        return metodsPostsDB.getPost(id)
    },
    async updatePost(id: string, body: PostInputModel) {
        const result = await postsCollection.updateOne({id},{$set:{...body}})
        return result.matchedCount === 1
    },
    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await postsCollection.deleteMany({})
    },
}
