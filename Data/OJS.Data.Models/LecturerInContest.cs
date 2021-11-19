namespace OJS.Data.Models
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;

    public class LecturerInContest : AuditInfoEntity
    {
        public string LecturerId { get; set; }

        public virtual UserProfile Lecturer { get; set; }

        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; }
    }
}