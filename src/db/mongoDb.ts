import {MongoClient, Collection, WithId} from 'mongodb'
import { SETTINGS } from '../settings';
import {BlogViewModel} from '../blogs-module/types/dbType';
import {PostViewModel} from '../posts-module/types/dbType';
import { UserViewModelDB, UserInputModel} from '../users-module/types/users-type';
import {CommentPostModel, CommentViewModel} from '../comments-module/types/comments-type';
import {Sessions_Info, API_Info} from '../auth-module/types/auth-type'
import mongoose from "mongoose";

let client: MongoClient;

// let postsCollection: Collection<PostViewModel> ;
// let blogsCollection: Collection<BlogViewModel> ; 
let usersCollection: Collection<UserViewModelDB> ; 
let commentsCollection: Collection<CommentPostModel> ; 
let sessionsCollection: Collection<Sessions_Info>;
let apiRequestsCollection: Collection<API_Info>;

async function runFromDB(url = SETTINGS.MONGO_URL) {
    client = new MongoClient(url); // TODO delete this line
    try{
        await mongoose.connect(url, { dbName: SETTINGS.DB_NAME }); // подключаемся к базе данных через mongoose
        
        // TODO перенести все схемы в отдельные файлы и импортировать их сюда (infrastructure) 
        // postsCollection = client.db(SETTINGS.DB_NAME).collection<PostViewModel>("posts"); 
        
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
        await client.close(); // TODO delete this line
        await mongoose.disconnect(); // отключаемся от базы данных через mongoose
        return false; // для функции которая экспортирует эту функцию , что бы она обработала
    } 
}

// export {postsCollection, usersCollection, commentsCollection, runFromDB, client, sessionsCollection, apiRequestsCollection} 
export {usersCollection, commentsCollection, runFromDB, client, sessionsCollection, apiRequestsCollection} 



