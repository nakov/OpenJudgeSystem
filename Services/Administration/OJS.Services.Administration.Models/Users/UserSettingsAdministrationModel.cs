namespace OJS.Services.Administration.Models.Users;

using OJS.Data.Models.Users;
using OJS.Services.Infrastructure.Models.Mapping;
using System;

public class UserSettingsAdministrationModel : IMapFrom<UserSettings>, IMapTo<UserSettings>
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? City { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public byte? Age { get; set; }

    public string? Company { get; set; }

    public string? JobTitle { get; set; }

    public string? FacultyNumber { get; set; }

    public string? EducationalInstitution { get; set; }
}