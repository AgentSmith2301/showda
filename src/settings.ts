import {config} from 'dotenv'
config();

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    ADMIN_AUTH: 'admin:qwerty',
    PATH: {
        VIDEOS: '/videos',
        BLOGS: '/blogs',
        POSTS: '/posts',
        DELETEALL: '/testing/all-data',
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    DB_NAME: process.env.DB_NAME || ''
}


