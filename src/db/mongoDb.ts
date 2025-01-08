import {MongoClient, Collection} from 'mongodb'
import { SETTINGS } from '../settings';
import {BlogViewModel} from '../blogs-module/types/dbType';
import {PostViewModel} from '../posts-module/types/dbType';


const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL) 


let postsCollection: Collection<PostViewModel> ;
let blogsCollection: Collection<BlogViewModel> ; 

async function runFromDB() {

    try{
        await client.connect();
        await client.db("noNameNewDB").command({ping:1});
        postsCollection = client.db(SETTINGS.DB_NAME).collection<PostViewModel>("posts"); 
        blogsCollection = client.db(SETTINGS.DB_NAME).collection<BlogViewModel>("blogs"); 
        console.log('🫵  ты подключился к базе данных');
        return true; // для функции которая экспортирует эту функцию , что бы она обработала
    } catch(error) {
        console.log(error);
        await client.close();
        return false; // для функции которая экспортирует эту функцию , что бы она обработала
    } 
}

export {postsCollection, blogsCollection, runFromDB}

