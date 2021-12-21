namespace OJS.Data.Models
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;

    public class LecturerInContest : AuditInfoEntity
    {
        public string LecturerId { get; set; } = string.Empty;

        public virtual UserProfile Lecturer { get; set; } = new();

        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; } = new();
    }
}