namespace OJS.Services.Ui.Business.Validation.Implementations;

using Models.Submissions;
using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;

public class SubmissionResultsValidationService : ISubmissionResultsValidationService
{
    public ValidationResult GetValidationResult((UserInfoModel, Problem?, Participant?) validationInput)
    {
        var (userInfoModel, problem, participant) = validationInput;

        if (userInfoModel.Id == null)
        {
            return ValidationResult.Invalid(ValidationMessages.User.NotLoggedIn, SubmissionResultsValidation.UserNotLoggedIn.ToString());
        }

        if (problem == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.NotFound, SubmissionResultsValidation.ProblemNotFound.ToString());
        }

        if (participant == null && !userInfoModel.IsAdminOrLecturer)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NotRegisteredForExam, SubmissionResultsValidation.NotRegisteredForExam.ToString());
        }

        if (!problem.ShowResults && !userInfoModel.IsAdminOrLecturer)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.ProblemResultsNotAvailable, SubmissionResultsValidation.ProblemResultsNotAvailable.ToString());
        }

        return ValidationResult.Valid();
    }
}