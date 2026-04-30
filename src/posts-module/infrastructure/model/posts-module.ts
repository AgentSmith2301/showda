import mongoose from 'mongoose';
import {postsForSchema} from './posts-schema';
import { PostViewModel } from '../../types/dbType';

const postSchema = new mongoose.Schema(postsForSchema, {
    collection: 'posts', // название коллекции в базе данных
    versionKey: false, // отключаем __v
})

export const Posts = mongoose.model<PostViewModel>('posts', postSchema);




















