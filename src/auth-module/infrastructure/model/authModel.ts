import {apiRequests_for_Schema, schema_For_Sessions} from "./auth_schema";
import mongoose from "mongoose";

const apiRequestsSchema = new mongoose.Schema(apiRequests_for_Schema);
export const Api_Requests_Model = mongoose.model('apiRequests', apiRequestsSchema);

// schema_For_Sessions

const sessions_Schema = new mongoose.Schema(schema_For_Sessions);
export const Sessions_Model = mongoose.model('sessions', sessions_Schema);


