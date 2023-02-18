namespace OJS.Services.Ui.Business.Validation.Implementations;

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
        (Problem?, UserInfoModel, Participant?, ValidationResult, int, bool, SubmitSubmissionServiceModel, bool)
            validationInput)
    {
        var (problem, user, participant, contestValidationResult,
            userSubmissionTimeLimit, hasUserNotProcessedSubmissionForProblem, submitSubmissionServiceModel,
            shouldAllowBinaryFiles) = validationInput;

        if (user.Id == null)
        {
            return ValidationResult.Invalid(
                ValidationMessages.User.NotLoggedIn,
                SubmitSubmissionValidation.UserNotLoggedIn.ToString());
        }

        if (problem == null)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Problem.NotFound,
                SubmitSubmissionValidation.ProblemNotFound.ToString());
        }

        if (participant == null && !user.IsAdminOrLecturer)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Participant.NotRegisteredForExam,
                SubmitSubmissionValidation.NotRegisteredForExam.ToString());
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
            return ValidationResult.Invalid(
                ValidationMessages.Problem.ProblemNotAssignedToUser,
                SubmitSubmissionValidation.ProblemNotAssignedToUser.ToString());
        }

        var submissionType =
            problem.SubmissionTypesInProblems.FirstOrDefault(st =>
                st.SubmissionTypeId == submitSubmissionServiceModel.SubmissionTypeId);

        if (submissionType == null)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.SubmissionTypeNotFound,
                SubmitSubmissionValidation.SubmissionTypeNotFound.ToString());
        }

        if (shouldAllowBinaryFiles && !submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.BinaryFilesNotAllowed,
                SubmitSubmissionValidation.BinaryFilesNotAllowed.ToString());
        }

        if (!shouldAllowBinaryFiles && submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.TextUploadNotAllowed,
                SubmitSubmissionValidation.TextUploadNotAllowed.ToString());
        }

        if (hasUserNotProcessedSubmissionForProblem)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.UserHasNotProcessedSubmissionForProblem,
                SubmitSubmissionValidation.UserHasNotProcessedSubmissionForProblem.ToString());
        }

        if (problem.SourceCodeSizeLimit < submitSubmissionServiceModel.Content.Length)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.SubmissionTooLong,
                SubmitSubmissionValidation.SubmissionTooLong.ToString());
        }

        if (submitSubmissionServiceModel.Content.Length < 5)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.SubmissionTooShort,
                SubmitSubmissionValidation.SubmissionTooShort.ToString());
        }

        if (userSubmissionTimeLimit != 0)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.SubmissionWasSentTooSoon,
                SubmitSubmissionValidation.SubmissionWasSentTooSoon.ToString());
        }

        return ValidationResult.Valid();
    }

    private static bool IsUserAdminOrLecturerInContest(Contest contest, UserInfoModel currentUser)
    => currentUser.IsAdmin ||
               contest.LecturersInContests.Any(c => c.LecturerId == currentUser.Id) ||
               contest.Category!.LecturersInContestCategories.Any(cl => cl.LecturerId == currentUser.Id);
}