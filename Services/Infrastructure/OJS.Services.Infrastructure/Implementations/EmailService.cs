namespace OJS.Services.Infrastructure.Implementations;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using OJS.Services.Infrastructure.Emails;
using FluentExtensions.Extensions;
using OJS.Services.Infrastructure.Configurations;

public class EmailService : IEmailService, IDisposable
{
    private readonly SmtpClient mailClient;
    private readonly EmailServiceConfig emailConfig;

    public EmailService(IOptions<EmailServiceConfig> emailConfig)
    {
        this.emailConfig = emailConfig.Value;
        this.mailClient = new SmtpClient();
        this.mailClient.UseDefaultCredentials = false;
        this.mailClient.Credentials =
            new NetworkCredential(this.emailConfig.ServerUsername, this.emailConfig.ServerPassword);
        this.mailClient.Port = (int)this.emailConfig.ServerPort;
        this.mailClient.Host = this.emailConfig.ServerHost;
        this.mailClient.EnableSsl = true;
    }

    public void SendEmail(
        string recipient,
        string subject,
        string body)
    {
        var message = this.PrepareMessage(recipient, subject, body, null, null);

        this.mailClient.Send(message);
    }

    public void SendEmail(string recipient, string subject, string body, IEnumerable<string> bccRecipients)
    {
        var message = this.PrepareMessage(recipient, subject, body, bccRecipients, null);

        try
        {
            this.mailClient.Send(message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            // TODO
        }
    }

    public void SendEmail(
        string recipient,
        string subject,
        string body,
        IEnumerable<string>? bccRecipients,
        AttachmentCollection? attachments)
    {
        var message = this.PrepareMessage(recipient, subject, body, bccRecipients, attachments);

        try
        {
            this.mailClient.Send(message);
        }
        catch (Exception e)
        {
            // TODO
            Console.WriteLine(e);
        }
    }

    public async Task SendEmailAsync(
        string recipient,
        string subject,
        string body)
    {
        var message = this.PrepareMessage(recipient, subject, body, null, null);
        try
        {
            await this.mailClient.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            // TODO
            Console.WriteLine(ex);
        }
    }

    public async Task SendEmailAsync(
        string recipient,
        string subject,
        string body,
        IEnumerable<string> bccRecipients)
    {
        var message = this.PrepareMessage(recipient, subject, body, bccRecipients, null);
        try
        {
            await this.mailClient.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            // TODO
            Console.WriteLine(ex);
        }
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