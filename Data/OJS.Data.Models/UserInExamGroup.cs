namespace OJS.Data.Models
{
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;

    public class UserInExamGroup
    {
        public string UserId { get; set; }

        public UserProfile User { get; set; }

        public int ExamGroupId { get; set; }

        public ExamGroup ExamGroup { get; set; }
    }
}