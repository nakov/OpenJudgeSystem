namespace OJS.Services.Administration.Models.ExamGroups;

using AutoMapper;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class ExamGroupDeleteValidationServiceModel : IMapFrom<ExamGroup>
{
    [IgnoreMap]
    public bool ContestIsActive { get; set; }
}