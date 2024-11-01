import {DBType} from '../src/db/db';

export const video1: any = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now() + Math.random(),
}

export const dataset1: DBType = {
    videos: [video1],
}




