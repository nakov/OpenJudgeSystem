namespace OJS.Services.Infrastructure.Emails;

using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;
using SoftUni.Services.Infrastructure;

public interface IEmailService : IService
{
    void Dispose();

    void SendEmail(
        string recipient,
        string subject,
        string body);

    void SendEmail(
        string recipient,
        string subject,
        string body,
        IEnumerable<string>? bccRecipients = null,
        AttachmentCollection? attachments = null);

    Task SendEmailAsync(
        string recipient,
        string subject,
        string body);

    Task SendEmailAsync(
        string recipient,
        string subject,
        string body,
        IEnumerable<string>? bccRecipients = null);
}