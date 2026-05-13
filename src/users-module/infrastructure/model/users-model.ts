import { UserViewModel, UserViewModelDB} from '../../types/users-type';
import {usersForSchema} from './users-schema';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<UserViewModel>(usersForSchema, {
    collection: 'users',
    versionKey: false,  // отключаем __v
})

export const Users = mongoose.model<UserViewModelDB>('users', userSchema);