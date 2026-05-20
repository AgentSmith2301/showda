import {apiRequests_for_Schema} from "./api_Requests_schema";
import mongoose from "mongoose";

const apiRequestsSchema = new mongoose.Schema(apiRequests_for_Schema);
export const api_Requests_Model = mongoose.model('apiRequests', apiRequestsSchema);


