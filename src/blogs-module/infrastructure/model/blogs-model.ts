import mongoose, {HydratedDocument} from 'mongoose'
import {blogsForSchema} from './blogs-schema'
import { BlogViewModel } from '../../types/dbType';

const blogSchema = new mongoose.Schema<BlogViewModel>(blogsForSchema, {
    collection: 'blogs', // 
    versionKey: false,  // отключаем __v
});


export const Blogs = mongoose.model<BlogViewModel>('blogs', blogSchema);
// HydratedDocument типизация для методов модели, возвращающих документ
// export const Blogs: HydratedDocument<BlogViewModel> = mongoose.model('blogs', blogSchema); 








