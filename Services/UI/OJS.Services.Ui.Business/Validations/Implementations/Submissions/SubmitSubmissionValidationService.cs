namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using OJS.Services.Ui.Models.Submissions;
using System.Linq;
using System.Text;

public class SubmitSubmissionValidationService : ISubmitSubmissionValidationService
{
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusinessService;

    public SubmitSubmissionValidationService(ILecturersInContestsBusinessService lecturersInContestsBusinessService)
        => this.lecturersInContestsBusinessService = lecturersInContestsBusinessService;

    public ValidationResult GetValidationResult(
        (Problem?, UserInfoModel, Participant?, ValidationResult, int, bool, bool, SubmitSubmissionServiceModel)
            validationInput)
    {
        var (problem, user, participant, contestValidationResult,
                userSubmissionTimeLimit, hasUserNotProcessedSubmissionForProblem,
                hasUserNotProcessedSubmissionForContest, submitSubmissionServiceModel) =
            validationInput;

        if (problem == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.NotFound);
        }

        var problemId = problem.Id.ToString();

        if (participant != null &&
            !participant.Contest.AllowParallelSubmissionsInTasks &&
            hasUserNotProcessedSubmissionForContest)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.UserHasNotProcessedSubmissionForContest,
                problemId);
        }

        if (string.IsNullOrWhiteSpace(submitSubmissionServiceModel.StringContent) &&
            (submitSubmissionServiceModel.ByteContent == null || submitSubmissionServiceModel.ByteContent.Length == 0))
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionEmpty, problemId);
        }

        if (participant == null && !user.IsAdminOrLecturer && submitSubmissionServiceModel.Official)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NotRegisteredForExam, problemId);
        }

        if (!contestValidationResult.IsValid)
        {
            return contestValidationResult;
        }

        var isAdminOrLecturer = this.lecturersInContestsBusinessService
            .IsCurrentUserAdminOrLecturerInContest(participant?.Contest.Id)
            .GetAwaiter()
            .GetResult();

        if (submitSubmissionServiceModel.Official &&
            participant!.Contest.IsOnlineExam &&
            !isAdminOrLecturer &&
            participant.ProblemsForParticipants.All(p => p.ProblemId != problem.Id))
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.ProblemNotAssignedToUser, problemId);
        }

        var submissionType =
            problem.SubmissionTypesInProblems.FirstOrDefault(st =>
                st.SubmissionTypeId == submitSubmissionServiceModel.SubmissionTypeId);

        if (submissionType == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTypeNotFound, problemId);
        }

        var isFileUpload = submitSubmissionServiceModel.StringContent == null ||
                           submitSubmissionServiceModel.ByteContent != null;

        if (isFileUpload && !submissionType.SubmissionType.AllowedFileExtensions!.Contains(
                submitSubmissionServiceModel.FileExtension!))
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.InvalidExtension, problemId);
        }

        if (isFileUpload && !submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.BinaryFilesNotAllowed, problemId);
        }

        if (!isFileUpload && submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.TextUploadNotAllowed, problemId);
        }

        if (hasUserNotProcessedSubmissionForProblem)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.UserHasNotProcessedSubmissionForProblem,
                problemId);
        }

        if (submitSubmissionServiceModel.ByteContent != null &&
            problem.SourceCodeSizeLimit < submitSubmissionServiceModel.ByteContent.Length)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionFileTooBig, problemId);
        }

        if (submitSubmissionServiceModel.StringContent != null &&
            problem.SourceCodeSizeLimit < Encoding.UTF8.GetBytes(submitSubmissionServiceModel.StringContent).Length)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTooLong, problemId);
        }

        if (!isFileUpload && submitSubmissionServiceModel.StringContent!.Length < 5)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTooShort, problemId);
        }

        if (userSubmissionTimeLimit != 0)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionWasSentTooSoon, problemId);
        }

        return ValidationResult.Valid();
    }
}