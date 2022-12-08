using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Common.Models.Cache;

public class AllowedContestStrategiesServiceModel: IMapFrom<SubmissionType>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
}