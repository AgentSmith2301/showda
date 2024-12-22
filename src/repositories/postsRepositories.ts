import { PostInputModel, PostViewModel, allDB } from '../types/dbType';
import { metodsBlogsDB } from './blogsRepositories';
import {postsCollection, blogsCollection} from '../db/mongoDb'



export const metodsPostsDB = {
    async getAll(): Promise<PostViewModel[]> {
        // return allDB.posts;
        const result = await postsCollection.find({}, {
            projection: {
                _id: 0, 
                title: 1, 
                id: 1, 
                blogName: 1, 
                shortDescription: 1, 
                content: 1, 
                blogId: 1
            }
        }).toArray();
        return result
    },
    async getPost(id: string) {
        // const result = allDB.posts.find((value) => value.id === id );
        const result = await postsCollection.findOne({id}, {
            projection: {
                _id: 0, 
                title: 1, 
                id: 1, 
                blogName: 1, 
                shortDescription: 1, 
                content: 1, 
                blogId: 1
            }
        })
        return result;
    },
    async createPost(post: PostInputModel): Promise<PostViewModel | null> {
        let id = Date.now().toString();
        // const result = await postsCollection.insertOne()
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
                blogName: blogName 
            }
            await postsCollection.insertOne(baseUpdate)
        } else {
            blogName = 'NOT FIND'
        }

        // let blogNotUndefined = metodsBlogsDB.getBlog(post.blogId);
        // let result: string;
        // if(blogNotUndefined !== undefined) {
        //     result = blogNotUndefined.name;
        // } else {
        //     result = 'NOT FIND'
        // }


        return metodsPostsDB.getPost(id)

        // allDB.posts.push(baseUpdate)
        // return baseUpdate
    },
    async updatePost(id: string, body: PostInputModel) {
        const result = await postsCollection.updateOne({id},{$set:{...body}})
        return result.matchedCount === 1
        
        // const searchFromBase = allDB.posts.findIndex((value) => value.id === id);
        // if(searchFromBase >= 0) {
        //     let result = allDB.posts.filter((value, index) => searchFromBase === index)
        //     allDB.posts.splice(searchFromBase,1, {...result[0], ...body})
        //     return true;
        // } else {
        //     return false;
        // }
    },
    async deletePost(id: string) {
        const result = await postsCollection.deleteOne({id})
        
        // let result = allDB.posts.findIndex((value) => value.id === id);
        // allDB.posts.splice(result,1)
        // return result;
        
        return result.deletedCount === 1
    },
    async deleteAll() {
        // allDB.posts = [];
        await postsCollection.deleteMany({})
    },
}
