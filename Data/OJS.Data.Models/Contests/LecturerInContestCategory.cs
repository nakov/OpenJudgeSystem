namespace OJS.Data.Models.Contests
{
    using OJS.Data.Infrastructure.Models;
    using OJS.Data.Models.Users;

    public class LecturerInContestCategory : AuditInfoEntity
    {
        public string LecturerId { get; set; }

        public virtual UserProfile Lecturer { get; set; }


        public int ContestCategoryId { get; set; }

        public virtual ContestCategory ContestCategory { get; set; }
    }
}