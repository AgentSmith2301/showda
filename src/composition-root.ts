import {BlogsRepositories} from './blogs-module/infrastructure/repositories/blogsRepositories';
import {BlogsService} from './blogs-module/service/blogs-service';
import {BlogsControllers} from './blogs-module/controllers/blogsControllers';
import {GetBlogMethods} from './blogs-module/infrastructure/repositories/blogs-query-repository';
import {Blogs} from './blogs-module/infrastructure/model/blogs-model'

import {PostsControllerststs} from './posts-module/controllers/postsControllers';
import {ServicePostsMethods} from './posts-module/service/posts-service';
import {MetodsPostsDB} from './posts-module/repositories/postsRepositories';
import {GetPostsMetodsDb} from './posts-module/repositories/posts-query-repository';

import {AuthController} from './auth-module/controllers/auth-controller';
import {AuthServiceMethods} from './auth-module/service/auth-service';
import {AuthRepoMethods} from './auth-module/repositories/auth-repositories';

import {UsersController} from './users-module/controllers/users-controllers';
import {UsersServiceMethods} from './users-module/service/users-service';
import {UsersRepoMethods} from './users-module/repositories/users-repositories';

import {CommentsRepositories} from './comments-module/repositories/comments-repository';
import {ServiceComments} from './comments-module/service/comments-service';
import {CommentsController} from './comments-module/controllers/comments-controller';
import {QueryCommentsRepositories} from './comments-module/repositories/comments-query-repository';

import {SETTINGS} from './settings'
import {Container} from 'inversify';  

export const container = new Container();

container.bind(CommentsController).toSelf();
container.bind(ServiceComments).toSelf();
container.bind(CommentsRepositories).toSelf();
container.bind(QueryCommentsRepositories).toSelf();

container.bind(BlogsControllers).toSelf();
container.bind(BlogsService).toSelf();
container.bind(GetBlogMethods).toSelf();
container.bind(BlogsRepositories).toSelf();
container.bind(SETTINGS.TYPES.blogsModel).toConstantValue(Blogs);

container.bind(PostsControllerststs).toSelf()
container.bind(ServicePostsMethods).toSelf()
container.bind(MetodsPostsDB).toSelf()
container.bind(GetPostsMetodsDb).toSelf()

container.bind(AuthController).toSelf()
container.bind(AuthServiceMethods).toSelf()
container.bind(AuthRepoMethods).toSelf()

container.bind(UsersController).toSelf()
container.bind(UsersServiceMethods).toSelf()
container.bind(UsersRepoMethods).toSelf()





