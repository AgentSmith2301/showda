import nodemailer from 'nodemailer'
import {APIErrorResult, MailInfo} from '../types/auth-type'
import { SETTINGS } from '../../settings';


const transport = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465, 
    secure: true, 
    auth: {
        user: "tamerlan346_95@mail.ru",
        pass: "3mZ9VumzzYbTCbyfdRYa"
    }
});


export async function sendEmail(to: string, subject: string, html: string): Promise<MailInfo | APIErrorResult> {
    try {
        const info = await transport.sendMail({
            from: `SHOWDA <${SETTINGS.EMAIL_SEND_FROM}>`,
            to,
            subject,
            html,
            text: 'перейдите по ссылке для подтверждения https://showda.vercel.app/'
        })

        return {
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response,
        }

    } catch (err) {
        console.log(err, '<==== err')
        return {
            errorsMessages: [{
                message: `Mail Error: ${err}`,
                field: 'something went wrong when sending a letter'
            }]
        }
    }
}
