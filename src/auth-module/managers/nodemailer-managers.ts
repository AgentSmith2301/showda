import { SETTINGS } from '../../settings';
import { sendEmail} from '../adapters/nodemailer-adapter' //resendMail,

export const nodemailer_Managers = {
    // вернуть нужный путь с кодом
    determine_The_Path(host: string, code: string): string {
        const baseUrl = host.split(':');
        if(baseUrl[0] === 'localhost' || baseUrl[0] === '127.0.0.1') { // host === 'localhost:3003'
            return `http://localhost:3003/auth/frontend/check-email?code=${code}`;
        } else {
            return `https://showda.vercel.app/auth/frontend/check-email?code=${code}`;
        }
    },
    
    async confirmation_Mail(emailConfirmation: {confirmationCode: string; email: string, host: string}) {

        const confirmLink: string = this.determine_The_Path(emailConfirmation.host, emailConfirmation!.confirmationCode);

        let textEmail = '<b style="font-size: 20px">для завершения регистрации</b> <a href= ' + confirmLink + ' style="font-size: 20px">нажмите здесь</a>';
        return await sendEmail(emailConfirmation.email, 'CONFIRMATION CODE', textEmail);

    },

}


