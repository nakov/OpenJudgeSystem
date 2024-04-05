namespace OJS.Services.Administration.Models.ExamGroups;

using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ExamGroupInListModel : IMapFrom<ExamGroup>
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? ContestName { get; set; }

    public string? ExternalAppId { get; set; }

    public int? ExternalExamGroupId { get; set; }
}