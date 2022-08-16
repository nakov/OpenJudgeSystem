using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

namespace OJS.Services.Ui.Models.Contests;

public class RegisterUserForContestServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = String.Empty;

    public bool RequirePassword { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Contest, RegisterUserForContestServiceModel>()
            .ForAllOtherMembers(opt => opt.Ignore());
}