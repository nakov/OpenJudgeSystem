namespace OJS.Services.Administration.Models.ExamGroups;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ExamGroupDeleteValidationServiceModel : IMapFrom<ExamGroup>
{
    [IgnoreMap]
    public bool ContestIsActive { get; set; }
}