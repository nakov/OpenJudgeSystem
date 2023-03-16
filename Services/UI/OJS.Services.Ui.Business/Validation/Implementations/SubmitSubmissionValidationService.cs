namespace OJS.Services.Ui.Business.Validation.Implementations;

using Infrastructure.Exceptions;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using Models.Submissions;
using System.Linq;

public class SubmitSubmissionValidationService : ISubmitSubmissionValidationService
{
    public ValidationResult GetValidationResult(
        (Problem?, UserInfoModel, Participant?, ValidationResult, int, bool, SubmitSubmissionServiceModel)
            validationInput)
    {
        var (problem, user, participant, contestValidationResult,
                userSubmissionTimeLimit, hasUserNotProcessedSubmissionForProblem, submitSubmissionServiceModel) =
            validationInput;

        if (string.IsNullOrWhiteSpace(submitSubmissionServiceModel.StringContent) &&
            (submitSubmissionServiceModel.ByteContent == null || submitSubmissionServiceModel.ByteContent.Length == 0))
        {
            throw new BusinessServiceException(ValidationMessages.Submission.SubmissionEmpty);
        }

        if (problem == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.NotFound);
        }

        if (participant == null && !user.IsAdminOrLecturer && submitSubmissionServiceModel.Official)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NotRegisteredForExam);
        }

        if (!contestValidationResult.IsValid)
        {
            return contestValidationResult;
        }

        if (submitSubmissionServiceModel.Official &&
            participant!.Contest.IsOnline &&
            !IsUserAdminOrLecturerInContest(participant.Contest, user) &&
            participant.ProblemsForParticipants.All(p => p.ProblemId != problem.Id))
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.ProblemNotAssignedToUser);
        }

        var submissionType =
            problem.SubmissionTypesInProblems.FirstOrDefault(st =>
                st.SubmissionTypeId == submitSubmissionServiceModel.SubmissionTypeId);

        if (submissionType == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTypeNotFound);
        }

        var isFileUpload = submitSubmissionServiceModel.StringContent == null ||
                           submitSubmissionServiceModel.ByteContent != null;

        if (isFileUpload && !submissionType.SubmissionType.AllowedFileExtensions!.Contains(
                submitSubmissionServiceModel.FileExtension!))
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.InvalidExtension);
        }

        if (isFileUpload && !submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.BinaryFilesNotAllowed);
        }

        if (!isFileUpload && submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.TextUploadNotAllowed);
        }

        if (hasUserNotProcessedSubmissionForProblem)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.UserHasNotProcessedSubmissionForProblem);
        }

        if (submitSubmissionServiceModel.StringContent != null &&
            problem.SourceCodeSizeLimit < submitSubmissionServiceModel.StringContent.Length)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTooLong);
        }

        if (!isFileUpload && submitSubmissionServiceModel.StringContent!.Length < 5)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTooShort);
        }

        if (userSubmissionTimeLimit != 0)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionWasSentTooSoon);
        }

        return ValidationResult.Valid();
    }

    private static bool IsUserAdminOrLecturerInContest(Contest contest, UserInfoModel currentUser)
        => currentUser.IsAdmin ||
           contest.LecturersInContests.Any(c => c.LecturerId == currentUser.Id) ||
           contest.Category!.LecturersInContestCategories.Any(cl => cl.LecturerId == currentUser.Id);
}