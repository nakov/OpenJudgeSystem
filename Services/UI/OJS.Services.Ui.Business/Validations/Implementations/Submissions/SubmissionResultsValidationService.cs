namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using Models.Submissions;
using Submissions;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using Validation;

public class SubmissionResultsValidationService : ISubmissionResultsValidationService
{
    public ValidationResult GetValidationResult((UserInfoModel, ProblemForSubmissionDetailsServiceModel?, ParticipantSubmissionResultsServiceModel?, bool) validationInput)
    {
        var (userInfoModel, problem, participant, isOfficial) = validationInput;

        if (problem == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.NotFound);
        }

        if (participant == null && !userInfoModel.IsAdminOrLecturer && isOfficial)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NotRegisteredForExam);
        }

        if (!problem.ShowResults)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.ProblemSubmissionsNotAvailable);
        }

        return ValidationResult.Valid();
    }
}