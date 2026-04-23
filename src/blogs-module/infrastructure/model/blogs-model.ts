import mongoose, {HydratedDocument} from 'mongoose'
import {blogsForSchema} from './blogs-schema'
import { BlogViewModel } from '../../types/dbType';

const blogSchema = new mongoose.Schema<BlogViewModel>(blogsForSchema, {
    collection: 'blogs',
    versionKey: false,  // отключаем __v
});


export const Blogs = mongoose.model<BlogViewModel>('blogs', blogSchema);
// export const Blogs: HydratedDocument<BlogViewModel> = mongoose.model('blogs', blogSchema); // BlogViewModel тип не подходит так как 
// в базе есть другие поля которых нет в BlogViewModel , например _id , нужно прописать отдельный тип BlogDBModel







