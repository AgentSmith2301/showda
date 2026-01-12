import {MongoClient, Collection, WithId} from 'mongodb'
import { SETTINGS } from '../settings';
import {BlogViewModel} from '../blogs-module/types/dbType';
import {PostViewModel} from '../posts-module/types/dbType';
import { UserViewModelDB, UserInputModel} from '../users-module/types/users-type';
import {CommentPostModel, CommentViewModel} from '../comments-module/types/comments-type';
import {Sessions_Info, API_Info} from '../auth-module/types/auth-type'

let client: MongoClient;

let postsCollection: Collection<PostViewModel> ;
let blogsCollection: Collection<BlogViewModel> ; 
let usersCollection: Collection<UserViewModelDB> ; 
let commentsCollection: Collection<CommentPostModel> ; 
let sessionsCollection: Collection<Sessions_Info>;
let apiRequestsCollection: Collection<API_Info>;

async function runFromDB(url = SETTINGS.MONGO_URL) {
    client = new MongoClient(url)
    try{
        await client.connect();
        await client.db("noNameNewDB").command({ping:1});
        postsCollection = client.db(SETTINGS.DB_NAME).collection<PostViewModel>("posts"); 
        blogsCollection = client.db(SETTINGS.DB_NAME).collection<BlogViewModel>("blogs"); 
        usersCollection = client.db(SETTINGS.DB_NAME).collection<UserViewModelDB>("users");
        commentsCollection = client.db(SETTINGS.DB_NAME).collection<CommentPostModel>("comments"); 
        sessionsCollection = client.db(SETTINGS.DB_NAME).collection<Sessions_Info>('sessions');
        apiRequestsCollection = client.db(SETTINGS.DB_NAME).collection<API_Info>('apiRequests');

        await apiRequestsCollection.createIndex({date:1}, {expireAfterSeconds: 600})
        await sessionsCollection.createIndex({revokedAt: 1}, {expireAfterSeconds: 0})
        console.log('🫵  ты подключился к базе данных');
        return true; // для функции которая экспортирует эту функцию , что бы она обработала 

    } catch(error) {
        console.log(error);
        await client.close();
        return false; // для функции которая экспортирует эту функцию , что бы она обработала
    } 
}

export {postsCollection, blogsCollection, usersCollection, commentsCollection, runFromDB, client, sessionsCollection, apiRequestsCollection} 

