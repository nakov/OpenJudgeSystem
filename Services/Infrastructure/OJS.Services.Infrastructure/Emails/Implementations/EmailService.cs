namespace OJS.Services.Infrastructure.Emails.Implementations
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Mail;
    using System.Text;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using Microsoft.Extensions.Options;
    using OJS.Services.Common.Models.Configurations;

    public class EmailService : IEmailService, IDisposable
    {
        private readonly SmtpClient mailClient;
        private readonly EmailServiceConfig emailConfig;

        public EmailService(IOptions<EmailServiceConfig> emailConfig)
        {
            this.emailConfig = emailConfig.Value;
            this.mailClient = new SmtpClient
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(this.emailConfig.ServerUsername, this.emailConfig.ServerPassword),
                Port = this.emailConfig.ServerPort,
                Host = this.emailConfig.ServerHost,
                EnableSsl = true,
            };
        }

        public void SendEmail(
            string recipient,
            string subject,
            string body,
            IEnumerable<string>? bccRecipients = null,
            AttachmentCollection? attachments = null)
        {
            var message = this.PrepareMessage(recipient, subject, body, bccRecipients, attachments);

            this.mailClient.Send(message);
        }

        public async Task SendEmailAsync(
            string recipient,
            string subject,
            string body,
            IEnumerable<string>? bccRecipients = null)
        {
            var message = this.PrepareMessage(recipient, subject, body, bccRecipients, null);
            await this.mailClient.SendMailAsync(message);
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.mailClient?.Dispose();
            }
        }

        private MailMessage PrepareMessage(
            string recipient,
            string subject,
            string body,
            IEnumerable<string>? bccRecipients,
            AttachmentCollection? attachments)
        {
            var mailTo = new MailAddress(recipient);
            var mailFrom = new MailAddress(this.emailConfig.SenderEmail, this.emailConfig.SenderDisplayValue);

            var message = new MailMessage(mailFrom, mailTo)
            {
                Body = body,
                BodyEncoding = Encoding.UTF8,
                IsBodyHtml = true,
                Subject = subject,
                SubjectEncoding = Encoding.UTF8,
            };

            if (bccRecipients != null)
            {
                foreach (var bccRecipient in bccRecipients)
                {
                    message.Bcc.Add(bccRecipient);
                }
            }

            if (attachments != null && attachments.Any())
            {
                message.Attachments.AddRange(attachments);
            }

            return message;
        }
    }
}
