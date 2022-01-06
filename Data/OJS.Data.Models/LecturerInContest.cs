namespace OJS.Data.Models
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;

    public class LecturerInContest : AuditInfoEntity
    {
        public string LecturerId { get; set; } = string.Empty;

        public virtual UserProfile Lecturer { get; set; } = null!;

        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; } = null!;
    }
}