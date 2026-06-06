import { LikeDB } from '../../type/like-types';
import {likeForSchema} from './like-schema';
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema<LikeDB>(likeForSchema);
export const LikeModel = mongoose.model('Like', likeSchema);

