namespace OJS.Services.Common.Emails
{
    using System.Collections.Generic;
    using System.Net.Mail;
    using System.Threading.Tasks;

    public interface IEmailSenderService
    {
        void SendEmail(
            string recipient,
            string subject,
            string body,
            IEnumerable<string> bccRecipients = null,
            AttachmentCollection attachments = null);

        Task SendEmailAsync(
            string recipient,
            string subject,
            string body,
            IEnumerable<string> bccRecipients = null);

        /// <summary>
        /// A method that will return softuni dev email
        /// </summary>
        string GetDevEmail();
    }
}