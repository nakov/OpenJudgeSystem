namespace OJS.Services.Administration.Models.Contests.Problems;

using OJS.Services.Common.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ContestDeleteProblemsValidationServiceModel : IMapFrom<ContestActivityServiceModel>
{
    public int Id { get; set; }

    public bool IsActive { get; set; }
}