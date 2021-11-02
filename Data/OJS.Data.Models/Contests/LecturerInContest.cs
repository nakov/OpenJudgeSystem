namespace OJS.Data.Models.Contests
{
    using OJS.Data.Infrastructure.Models;
    using OJS.Data.Models.Users;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class LecturerInContest : AuditInfoEntity
    {
        public string LecturerId { get; set; }

        public virtual UserProfile Lecturer { get; set; }

        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; }
    }
}