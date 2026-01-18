import {apiRequestsCollection } from "../../db/mongoDb";
import { API_Info } from "../types/auth-type";

export const rateLimiteRepositories = {
    async create_Url_Info(ip: string, url: string, dateTime: Date, body: any ): Promise<void> { //TODO удалить после получения данных body
        await apiRequestsCollection.insertOne({IP: ip, URL: url, date: dateTime, body}) //TODO удалить после получения данных body

    },

    async check_Request_Caunt(ip: string, url: string, checkDate: Date): Promise<number> {  
        // верхнюю границу не указываем так как она не нужна, документы и так вернутся до текущего момента
        //                      👇 считаем ТОЛЬКО ЭТО
        // ────────────────┆════════════════╗
        //                -10s               NOW
        return await apiRequestsCollection.countDocuments({IP:ip, URL:url, date: {$gte: checkDate}}) 
    },
};




















