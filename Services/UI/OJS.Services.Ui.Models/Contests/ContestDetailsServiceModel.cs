﻿namespace OJS.Services.Ui.Models.Contests;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using System.Linq;

public class ContestDetailsServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public bool IsUserParticipant { get; set; }

    public bool IsOnlineExam { get; set; }

    public bool CanBeCompeted { get; set; }

    public ICollection<ContestProblemServiceModel> Problems { get; set; } = new HashSet<ContestProblemServiceModel>();

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<Contest, ContestDetailsServiceModel>()
            .ForMember(
                d => d.Problems,
                opt => opt.MapFrom(s =>
                    s.ProblemGroups
                        .SelectMany(pg => pg.Problems)
                        .OrderBy(p => p.ProblemGroup.OrderBy)
                        .ThenBy(p => p.OrderBy)))
            .ForMember(d => d.IsUserParticipant, opt => opt.Ignore());
}