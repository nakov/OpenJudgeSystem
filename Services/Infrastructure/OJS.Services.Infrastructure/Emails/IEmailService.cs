namespace OJS.Services.Infrastructure.Emails;

using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;

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
        IEnumerable<string> bccRecipients);
    void SendEmail(
        string recipient,
        string subject,
        string body,
        IEnumerable<string> bccRecipients,
        AttachmentCollection attachments);

    Task SendEmailAsync(
        string recipient,
        string subject,
        string body);

    Task SendEmailAsync(
        string recipient,
        string subject,
        string body,
        IEnumerable<string> bccRecipients);
}