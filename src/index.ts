import {app} from './app'
import {SETTINGS} from './settings';

app.listen(SETTINGS.PORT, () => {
    console.log(`сервер на запущен , порт ${SETTINGS.PORT}`)
})

