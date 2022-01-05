namespace OJS.Data.Models
{
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;

    public class LecturerInContestCategory : AuditInfoEntity
    {
        public string LecturerId { get; set; } = string.Empty;

        public virtual UserProfile? Lecturer { get; set; }


        public int ContestCategoryId { get; set; }

        public virtual ContestCategory? ContestCategory { get; set; }
    }
}