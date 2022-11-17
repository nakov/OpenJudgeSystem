namespace OJS.Data.Models.Users
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Utils;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using static OJS.Data.Validation.ConstraintConstants.User;

    [Owned]
    public class UserSettings
    {
        [Column(nameof(FirstName))]
        [MaxLength(NameMaxLength)]
        [MinLength(NameMinLength)]
        public string? FirstName { get; set; }

        [Column(nameof(LastName))]
        [MaxLength(NameMaxLength)]
        public string? LastName { get; set; }

        [Column(nameof(City))]
        [MinLength(CityMinLength)]
        [MaxLength(CityMaxLength)]
        public string? City { get; set; }

        [Column(nameof(EducationalInstitution))]
        public string? EducationalInstitution { get; set; }

        [Column(nameof(FacultyNumber))]
        [MaxLength(FacultyNumberMaxLength)]
        public string? FacultyNumber { get; set; }

        [Column(nameof(DateOfBirth))]
        public DateTime? DateOfBirth { get; set; }

        [Column(nameof(Company))]
        [MaxLength(CompanyMaxLength)]
        [MinLength(CompanyMinLength)]
        public string? Company { get; set; }

        [Column(nameof(JobTitle))]
        [MaxLength(JobTitleMaxLength)]
        [MinLength(JobTitleMinLength)]
        public string? JobTitle { get; set; }

        [NotMapped]
        public byte? Age => Calculator.Age(this.DateOfBirth);
    }
}