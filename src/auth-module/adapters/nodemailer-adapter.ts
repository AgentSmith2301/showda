import nodemailer from 'nodemailer'
import {APIErrorResult, MailInfo} from '../types/auth-type'

const transport = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465, 
    secure: true, 
    // service: 'yandex',
    auth: {
        user: "tamerlan346_95@mail.ru",
        pass: "3mZ9VumzzYbTCbyfdRYa"
    }
});

//TODO в дальнейшем перенеси функцию отправки писем в managers
export async function sendEmail(to: string, subject: string, html: string): Promise<MailInfo | APIErrorResult> {
    try {
        const info = await transport.sendMail({
            from: "CONFIRMATION CODE <tamerlan346_95@mail.ru>",
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

// sendEmail('tamerlan346@gmail.com', 'this is main email for you', '<b>message from yandex</b>')