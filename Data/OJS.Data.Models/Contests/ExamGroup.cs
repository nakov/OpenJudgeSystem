namespace OJS.Data.Models.Contests
{
    using SoftUni.Data.Infrastructure.Models;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using static OJS.Data.Validation.ConstraintConstants.ExamGroup;

    public class ExamGroup : Entity<int>
    {
        public int? ExternalExamGroupId { get; set; }

        public string ExternalAppId { get; set; }

        [Required]
        [MinLength(NameMinLength)]
        [MaxLength(NameMaxLength)]
        public string Name { get; set; }

        public int? ContestId { get; set; }

        public Contest Contest { get; set; }

        public ICollection<UserInExamGroup> UsersInExamGroups { get; set; } = new HashSet<UserInExamGroup>();

        public override string ToString() => this.Name;
    }
}