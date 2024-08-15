namespace OJS.Services.Administration.Business.SubmissionTypes.Validators;

using OJS.Data.Models.Submissions;
using OJS.Services.Common.Validation;

public interface IDeleteOrReplaceSubmissionTypeValidationService : IValidationService<(
    int,
    int?,
    SubmissionType?,
    SubmissionType?,
    bool shouldDoSubmissionsDeletion)>
{
}