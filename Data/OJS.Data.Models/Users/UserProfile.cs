namespace OJS.Data.Models.Users
{
    using Microsoft.AspNetCore.Identity;
    using OJS.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using static OJS.Data.Validation.ConstraintConstants.User;

    public class UserProfile : IdentityUser, IDeletableEntity<string>, IAuditInfoEntity
    {
        [Required]
        [MaxLength(EmailMaxLength)]
        [MinLength(EmailMinLength)]
        [RegularExpression(EmailRegEx)]
        [DataType(DataType.EmailAddress)]
        public override string Email { get; set; }

        public UserSettings UserSettings { get; set; } = new();

        public bool IsDeleted { get; set; }

        public DateTime? DeletedOn { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public virtual ICollection<LecturerInContest> LecturersInContests { get; set; } =
            new HashSet<LecturerInContest>();

        public virtual ICollection<LecturerInContestCategory> LecturersInContestCategories { get; set; } =
            new HashSet<LecturerInContestCategory>();

        public virtual ICollection<UsersInExamGroups> UsersInExamGroups { get; set; } =
            new HashSet<UsersInExamGroups>();
    }
}