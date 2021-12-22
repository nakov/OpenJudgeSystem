namespace OJS.Data.Models
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Users;

    public class AccessLog : AuditInfoEntity<int>
    {
        public string UserId { get; set; } = string.Empty;

        public virtual UserProfile User { get; set; } = new();

        public string IpAddress { get; set; } = string.Empty;

        public string RequestType { get; set; } = string.Empty;

        public string Url { get; set; } = string.Empty;

        public string? PostParams { get; set; }
    }
}