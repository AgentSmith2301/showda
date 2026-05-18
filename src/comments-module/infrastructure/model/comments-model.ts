import mongoose from 'mongoose';
import {comments_Schema} from './comments-schema';
import {CommentPostModel} from '../../types/comments-type';

const comment_Schema = new mongoose.Schema<CommentPostModel>(comments_Schema, {
    collection: 'comments', // имя коллекции в MongoDB
    versionKey: false,  // отключаем __v
});

export const Comments = mongoose.model<CommentPostModel>('comments', comment_Schema);














