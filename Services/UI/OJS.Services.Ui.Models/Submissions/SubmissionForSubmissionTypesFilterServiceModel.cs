namespace OJS.Services.Ui.Models.Submissions;

using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionForSubmissionTypesFilterServiceModel : IMapFrom<Submission>
{
    public int Id { get; set; }

    public int? SubmissionTypeId { get; set; }
}