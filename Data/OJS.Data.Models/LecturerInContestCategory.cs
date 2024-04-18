namespace OJS.Data.Models
{
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;
    using OJS.Data.Infrastructure.Models;

    public class LecturerInContestCategory : AuditInfoEntity
    {
        public string LecturerId { get; set; } = string.Empty;

        public virtual UserProfile Lecturer { get; set; } = null!;

        public int ContestCategoryId { get; set; }

        public virtual ContestCategory ContestCategory { get; set; } = null!;
    }
}