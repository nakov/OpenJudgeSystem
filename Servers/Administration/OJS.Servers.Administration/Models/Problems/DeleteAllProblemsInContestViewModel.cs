namespace OJS.Servers.Administration.Models.Problems;

using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure.Models.Mapping;

public class DeleteAllProblemsInContestViewModel : IMapFrom<ContestActivityServiceModel>
{
    public int Id { get; set; }

    public string? Name { get; set; }
}