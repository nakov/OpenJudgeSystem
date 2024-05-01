namespace OJS.Services.Common.Models.Cache;

using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure.Models.Mapping;

public class AllowedContestStrategiesServiceModel : IMapFrom<SubmissionType>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
}