import { Email } from './Email.js';

export class EmailSender {
  send(email: Email): void {
    process.stdout.write(`To:${email.to}, Subject: ${email.subject}, Message: ${email.message}`);
  }
}
