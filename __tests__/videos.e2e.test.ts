import {req} from './test-helpers';
import {SETTINGS} from '../src/settings';

describe('/videos', () => {
    it('should get empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200);

        console.log(res.body);

    })

    it('should get not empty array', async () => {
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200);

        console.log(res.body);
    })

    




})