namespace OJS.Services.Common.Models.Users
{
    using OJS.Data.Models.Users;
    using System;

    public class ExternalUserInfoModel
    {
        public string Id { get; set; } = string.Empty;

        public string UserName { get; set; } = string.Empty;

        public string? PasswordHash { get; set; }

        public string? SecurityStamp { get; set; }

        public string Email { get; set; } = string.Empty;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? City { get; set; }

        public string? EducationalInstitution { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public string? Company { get; set; }

        public string? JobTitle { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? DeletedOn { get; set; }

        public UserProfile Entity
            => new UserProfile
            {
                Id = this.Id,
                UserName = this.UserName,
                NormalizedUserName = this.UserName.ToUpper(),
                PasswordHash = this.PasswordHash,
                SecurityStamp = this.SecurityStamp,
                Email = this.Email,
                IsDeleted = this.IsDeleted,
                DeletedOn = this.DeletedOn,
                CreatedOn = this.CreatedOn,
                ModifiedOn = this.ModifiedOn,
                UserSettings = new UserSettings
                {
                    FirstName = this.FirstName,
                    LastName = this.LastName,
                    DateOfBirth = this.DateOfBirth,
                    City = this.City,
                    EducationalInstitution = this.EducationalInstitution,
                    Company = this.Company,
                    JobTitle = this.JobTitle,
                },
            };
    }
}