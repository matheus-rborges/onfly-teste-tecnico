import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { Environment } from '../singletons';
import { EmailPayload } from '../../interfaces';

@Injectable()
export class EmailService {
    private environment: Environment;

    constructor() {
        this.environment = Environment.getInstance();
    }

    async sendEmail(toEmail: string, body: string, subject: string) {
        const transporter = createTransport({
            host: this.environment.EMAIL_HOST,
            port: +this.environment.EMAIL_PORT,
            secure: false,
            auth: {
                user: this.environment.EMAIL_USER,
                pass: this.environment.EMAIL_PASSWORD,
            },
        });

        const payload: EmailPayload = {
            to: toEmail,
            from: this.environment.EMAIL_USER,
            subject,
            text: body,
        };

        await transporter.sendMail(payload);
    }
}
