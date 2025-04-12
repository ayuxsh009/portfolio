declare module "nodemailer" {
    export interface Transporter {
      sendMail(mailOptions: Mail.Options): Promise<any>
    }
  
    export namespace Mail {
      export interface Options {
        from?: string
        to?: string
        cc?: string
        bcc?: string
        subject?: string
        text?: string
        html?: string
        replyTo?: string
        [key: string]: any
      }
    }
  
    export function createTransport(options: any): Transporter
  }
  