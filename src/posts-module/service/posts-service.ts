import { PostInputModel, PostViewModel } from '../types/dbType';
import { GetBlogMethods } from '../../blogs-module/repositories/blogs-query-repository';
import { MetodsPostsDB } from '../repositories/postsRepositories';
import { GetPostsMetodsDb } from '../repositories/posts-query-repository'
import { CommentViewModel } from '../../comments-module/types/comments-type';
import { AuthRepoMethods } from '../../auth-module/repositories/auth-repositories';
import {ServiceComments} from '../../comments-module/service/comments-service'
import {injectable, inject } from 'inversify'; 

@injectable()
export class ServicePostsMethods {

    constructor(
        @inject(MetodsPostsDB) public metodsPostsDB: MetodsPostsDB,
        @inject(AuthRepoMethods) public authRepoMethods: AuthRepoMethods,
        @inject(GetBlogMethods) public getBlogMethods: GetBlogMethods,
        @inject(GetPostsMetodsDb) public getPostsMetodsDb: GetPostsMetodsDb,
        @inject(ServiceComments) public serviceComments: ServiceComments
    ) {} // неявное внедрение класса
    
    async createPost(post: PostInputModel): Promise<PostViewModel | null> {
        let id = Date.now().toString();
        const createdAt = new Date().toISOString();
        let blogName: string;
        const findBlogs = await this.getBlogMethods.getBlog(post.blogId)
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
            await this.metodsPostsDB.createPost(baseUpdate)
        } else {
            blogName = 'NOT FIND'
        }
        return this.getPostsMetodsDb.getPost(id)
    }

    async updatePost(id: string, body: PostInputModel) {
        const result = await this.metodsPostsDB.updatePost(id,body)
        return result.matchedCount === 1
    }

    async deletePost(id: string) {
        const result = await this.metodsPostsDB.deletePost(id)
        return result.deletedCount === 1
    }

    async deleteAll() {
        await this.metodsPostsDB.deleteAll()
    }

    async commentsFromPost(postId: string, content: string, userId: string):Promise<CommentViewModel | null> {
        const userData = await this.authRepoMethods.getUserById(userId);
        if(!userData) return null

        const comentData =  {
            postId,
            content,
            commentatorInfo: 
                {
                    userId, 
                    userLogin: userData.login ,
                },
            createdAt: new Date().toISOString()
        }

        // создать коммент по посту
        return await this.serviceComments.createComment(comentData)
        
    }

    // async findBlogInBlogService(blogId) {
    //     await getBlogMethods
    // }

}
