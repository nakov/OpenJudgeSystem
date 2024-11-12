namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using OJS.Data.Models.Participants;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Validation;
using OJS.Services.Ui.Models.Cache;
using OJS.Services.Ui.Models.Submissions;

public interface ISubmitSubmissionValidationService
    : IValidationServiceAsync<(ProblemForSubmitCacheModel?, Participant?, SubmitSubmissionServiceModel, ContestCacheModel?, SubmissionType?)>
{
}