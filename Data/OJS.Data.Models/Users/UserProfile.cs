namespace OJS.Data.Models.Users
{
    using Microsoft.AspNetCore.Identity;
    using OJS.Data.Infrastructure.Models;
    using System;
    using System.ComponentModel.DataAnnotations;
    using static OJS.Data.Validation.ConstraintConstants.User;

    public class UserProfile : IdentityUser, IDeletableEntity, IAuditInfo, IEntity<string>
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
    }
}