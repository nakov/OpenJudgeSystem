namespace OJS.Data.Models
{
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;
    using SoftUni.Data.Infrastructure.Models;

    public class UserInExamGroup : IEntity
    {
        public string UserId { get; set; } = string.Empty;

        public virtual UserProfile User { get; set; } = null!;

        public int ExamGroupId { get; set; }

        public virtual ExamGroup ExamGroup { get; set; } = null!;
    }
}