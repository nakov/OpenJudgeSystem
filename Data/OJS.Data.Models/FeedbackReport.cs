namespace OJS.Data.Models
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Users;
    using System.ComponentModel.DataAnnotations;

    public class FeedbackReport : DeletableAuditInfoEntity<int>
    {
        public string? Name { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string? Content { get; set; }

        public string UserId { get; set; } = string.Empty;

        public virtual UserProfile? User { get; set; }

        public bool IsFixed { get; set; }
    }
}