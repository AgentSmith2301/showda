import {app} from './app';
import {SETTINGS} from './settings';
import {runFromDB, postsCollection, blogsCollection} from './db/mongoDb';

const startApp = async() => {
    const res = await runFromDB()
    if(!res) process.exit(1);

    app.listen(SETTINGS.PORT, () => {
        console.log(`server start in port ${SETTINGS.PORT}`)
    })
}
startApp()
