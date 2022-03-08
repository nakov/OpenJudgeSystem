namespace OJS.Servers.Administration.Models.Problems;

using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class DeleteAllProblemsInContestViewModel : IMapFrom<Contest>
{
    public int Id { get; set; }

    public string? Name { get; set; }
}