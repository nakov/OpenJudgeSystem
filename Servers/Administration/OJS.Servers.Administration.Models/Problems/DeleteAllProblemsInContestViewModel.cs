namespace OJS.Servers.Administration.Models.Problems;

using OJS.Services.Common.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class DeleteAllProblemsInContestViewModel : IMapFrom<ContestActivityServiceModel>
{
    public int Id { get; set; }

    public string? Name { get; set; }
}