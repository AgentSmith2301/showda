import { api_Requests_Model } from "../../infrastructure/model/api-RequestsModel";
import { API_Info } from "../../types/auth-type";

export const rateLimiteRepositories = {
    async create_Url_Info(ip: string, url: string, dateTime: Date, body: any): Promise<void> {  //TODO  delete body
        await api_Requests_Model.create({IP: ip, URL: url, date: dateTime, body: body}) //TODO  delete body

    },

    async check_Request_Caunt(ip: string, url: string, checkDate: Date): Promise<number> {  
        // верхнюю границу не указываем так как она не нужна, документы и так вернутся до текущего момента
        //                      👇 считаем ТОЛЬКО ЭТО
        // ────────────────┆════════════════╗
        //                -10s               NOW
        return await api_Requests_Model.countDocuments({IP:ip, URL:url, date: {$gte: checkDate}}) 
    },
};




















