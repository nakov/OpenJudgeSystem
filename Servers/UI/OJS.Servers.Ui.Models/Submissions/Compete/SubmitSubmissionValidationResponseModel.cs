namespace OJS.Servers.Ui.Models.Submissions.Compete;

using OJS.Services.Common.Models;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmitSubmissionValidationResponseModel : IMapFrom<SubmitSubmissionValidationServiceModel>
{
    public ValidationResult ValidationResult { get; set; } = null!;
}