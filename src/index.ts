import {app} from './app';
import {SETTINGS} from './settings';
// import {runDb} from './db/mongoDb';

app.listen(SETTINGS.PORT, () => {
    console.log(`server start in port ${SETTINGS.PORT}`)
})


// const startApp = async() => {
//     const res = await runDb(SETTINGS.MONGO_URL)
//     if(!res) process.exit(1);

//     app.listen(SETTINGS.PORT, () => {
//         console.log(`server start in port ${SETTINGS.PORT}`)
//     })
// }
// startApp()


// файл mongoDb ===============================================================
// export let videosCollection: Collection<VideoType>
// export let blogsCollection: any

// export async function runDb(url: string): Promise<boolean> {
//     let client = new MongoClient(url);
//     let db = client.db(SETTINGS.DB_NAME)

//     videosCollection = db.collection<VideoType>(SETTINGS.PATH.VIDEOS)
//     blogsCollection = db.collection<VideoType>(SETTINGS.PATH.BLOGS)

//     try{
//         await client.connect();
//         await db.command({ping: 1});
//         console.log('ok')
//         return  true
//     } catch (e) {
//         console.log(e)
//         await client.close()
//         return false
//     }

// }
