import { Injectable } from '@nestjs/common';
import { renderFile } from 'ejs';
import { join } from 'path';
import nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  async sendMail(
    to: string | string[],
    subject: string,
    tplName: string,
    locals: any,
  ): Promise<boolean> {
    const templatePath = join(
      __dirname,
      '../../views/email-templates',
      tplName,
      'html.ejs',
    );

    const getMailBody = await renderFile(templatePath, locals);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: 'My Project',
        address: process.env.MAIL_USERNAME,
      },
      to,
      subject,
      html: getMailBody,
    };

    await transporter.verify();
    await transporter.sendMail(mailOptions);
    return true;
  }
}
