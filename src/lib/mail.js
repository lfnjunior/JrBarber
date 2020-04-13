import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import nodemailerSendgrid from 'nodemailer-sendgrid';

class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: '',
      })
    );

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'views', 'email');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(msg) {
    return this.transporter.sendMail({
      ...{
        from: 'Equipe JrBarber <noreply@jrbarber.com>',
      },
      ...msg,
    });
  }
}

export default new Mail();
