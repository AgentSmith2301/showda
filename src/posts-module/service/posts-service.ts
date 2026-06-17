import { PostInputModel, PostViewModel } from '../types/dbType';
import { GetBlogMethods } from '../../blogs-module/infrastructure/repositories/blogs-query-repository';
import { MetodsPostsDB } from '../infrastructure/repositories/postsRepositories';
import { GetPostsMetodsDb } from '../infrastructure/repositories/posts-query-repository'
import { CommentPostModel, CommentViewModel } from '../../comments-module/types/comments-type';
import { AuthRepoMethods } from '../../auth-module/infrastructure/repositories/auth-repositories';
import {ServiceComments} from '../../comments-module/service/comments-service'
import {injectable, inject } from 'inversify'; 
import { CommentQyeryService } from '../../comments-module/service/comment-query-service';

@injectable()
export class ServicePostsMethods {

    constructor(
        @inject(MetodsPostsDB) public metodsPostsDB: MetodsPostsDB,
        @inject(AuthRepoMethods) public authRepoMethods: AuthRepoMethods,
        @inject(GetBlogMethods) public getBlogMethods: GetBlogMethods,
        @inject(GetPostsMetodsDb) public getPostsMetodsDb: GetPostsMetodsDb,
        @inject(ServiceComments) public serviceComments: ServiceComments,
        @inject(CommentQyeryService) public commentQueryService: CommentQyeryService
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
            blogName = 'NOT FIND';
            return null
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

        const comentData: CommentPostModel =  {
            postId,
            content,
            commentatorInfo: 
                {
                    userId, 
                    userLogin: userData.login ,
                },
            createdAt: new Date().toISOString(),
            likesCount: 0,
            dislikesCount: 0
        }

        // создать коммент по посту
        return await this.serviceComments.createComment(comentData)
        
    }

    async all_Posts_From_BlogId(blogId: string, filter: any) {
        return await this.getPostsMetodsDb.getAllPostsForBlog(blogId, filter);
    }

    async all_Comments_From_PostId(userId: string | null, postId: string, filter: any) {
        return await this.commentQueryService.getAllComments(userId, postId, filter);
    }

}
