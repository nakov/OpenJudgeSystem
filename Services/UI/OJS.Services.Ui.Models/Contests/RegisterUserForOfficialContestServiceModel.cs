using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

namespace OJS.Services.Ui.Models.Contests;

public class RegisterUserForOfficialContestServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = String.Empty;

    public bool RequirePassword { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Contest, RegisterUserForOfficialContestServiceModel>()
            .ForMember(d => d.RequirePassword, opt => opt.MapFrom(s => s.HasContestPassword));
}