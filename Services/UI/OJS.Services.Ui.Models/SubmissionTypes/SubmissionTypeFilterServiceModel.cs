namespace OJS.Services.Ui.Models.SubmissionTypes;

using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionTypeFilterServiceModel : IMapFrom<SubmissionType>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    [IgnoreMap]
    public int UsageOrder { get; set; }
}