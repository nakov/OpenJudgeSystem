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
        (Problem?, UserInfoModel, Participant?, ValidationResult, int, bool, SubmitSubmissionServiceModel)
            validationInput)
    {
        var (problem, user, participant, contestValidationResult,
            userSubmissionTimeLimit, hasUserNotProcessedSubmissionForProblem, submitSubmissionServiceModel) = validationInput;

        var shouldAllowBinaryFiles = false;

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

        if (submitSubmissionServiceModel.StringContent == null)
        {
            shouldAllowBinaryFiles = true;

            if (submitSubmissionServiceModel.ByteContent == null || submitSubmissionServiceModel.ByteContent.Length == 0)
            {
                return ValidationResult.Invalid(
                    ValidationMessages.Submission.UploadFile,
                    SubmitSubmissionValidation.UploadFile.ToString());
            }

            if (!submissionType.SubmissionType.AllowedFileExtensions!.Contains(
                    submitSubmissionServiceModel.FileExtension!))
            {
                return ValidationResult.Invalid(
                    ValidationMessages.Submission.InvalidExtension,
                    SubmitSubmissionValidation.InvalidExtension.ToString());
            }
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

        if (submitSubmissionServiceModel.StringContent != null && problem.SourceCodeSizeLimit < submitSubmissionServiceModel.StringContent.Length)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.SubmissionTooLong,
                SubmitSubmissionValidation.SubmissionTooLong.ToString());
        }

        if (submitSubmissionServiceModel.StringContent != null && submitSubmissionServiceModel.StringContent.Length < 5)
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