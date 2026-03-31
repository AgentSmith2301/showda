import {BlogsRepositories} from './blogs-module/repositories/blogsRepositories';
import { BlogsService } from './blogs-module/service/blogs-service';
import {BlogsControllers} from './blogs-module/controllers/blogsControllers';

import { PostsControllerststs } from './posts-module/controllers/postsControllers';
import { ServicePostsMethods } from './posts-module/service/posts-service';
import {MetodsPostsDB} from './posts-module/repositories/postsRepositories';

import { AuthController } from './auth-module/controllers/auth-controller';
import { AuthServiceMethods } from './auth-module/service/auth-service';
import { AuthRepoMethods } from './auth-module/repositories/auth-repositories';

import { UsersController } from './users-module/controllers/users-controllers';
import { UsersServiceMethods } from './users-module/service/users-service';
import { UsersRepoMethods } from './users-module/repositories/users-repositories';

import { Container} from 'inversify';  

export const container = new Container();
container.bind(BlogsRepositories).toSelf();
container.bind(BlogsService).toSelf();
container.bind(BlogsControllers).toSelf();

container.bind(PostsControllerststs).toSelf()
container.bind(ServicePostsMethods).toSelf()
container.bind(MetodsPostsDB).toSelf()

container.bind(AuthRepoMethods).toSelf()
container.bind(AuthServiceMethods).toSelf()
container.bind(AuthController).toSelf()

container.bind(UsersController).toSelf()
container.bind(UsersRepoMethods).toSelf()
container.bind(UsersServiceMethods).toSelf()





