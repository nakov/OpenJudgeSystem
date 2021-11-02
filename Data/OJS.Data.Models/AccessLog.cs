namespace OJS.Data.Models
{
    using OJS.Data.Infrastructure.Models;
    using OJS.Data.Models.Users;

    public class AccessLog : AuditInfoEntity<int>
    {
        public string UserId { get; set; }

        public UserProfile User { get; set; }

        public string IpAddress { get; set; }

        public string RequestType { get; set; }

        public string Url { get; set; }

        public string PostParams { get; set; }
    }
}