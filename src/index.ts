import {app} from './app';
import {SETTINGS} from './settings';

app.listen(SETTINGS.PORT, () => {
    console.log(`server start in port ${SETTINGS.PORT}`)
})
