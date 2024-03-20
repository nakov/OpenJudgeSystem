namespace OJS.Services.Administration.Models.Users;

using OJS.Data.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class UserSettingsAdministrationModel : IMapFrom<UserSettings>, IMapTo<UserSettings>
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? City { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public int Age { get; set; }
}