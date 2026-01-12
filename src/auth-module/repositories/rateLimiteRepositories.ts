import {apiRequestsCollection } from "../../db/mongoDb";
import { API_Info } from "../types/auth-type";

export const rateLimiteRepositories = {
    async create_Url_Info(ip: string, url: string, dateTime: Date ): Promise<void> {
        await apiRequestsCollection.insertOne({IP: ip, URL: url, date: dateTime})

    },

    async check_Request_Caunt(ip: string, url: string, date: Date): Promise<number> {
        return await apiRequestsCollection.countDocuments({IP:ip, URL:url, date: {$gte: date}})
    },
};




















