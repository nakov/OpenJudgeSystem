namespace OJS.Data.Models
{
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;

    public class UserInExamGroup
    {
        public string UserId { get; set; }

        public virtual UserProfile User { get; set; }

        public int ExamGroupId { get; set; }

        public virtual ExamGroup ExamGroup { get; set; }
    }
}