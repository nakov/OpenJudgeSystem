namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using OJS.Services.Ui.Models.Submissions;
using System.Linq;
using System.Text;

public class SubmitSubmissionValidationService : ISubmitSubmissionValidationService
{
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusinessService;
    private readonly IContestsActivityService activityService;

    public SubmitSubmissionValidationService(
        ILecturersInContestsBusinessService lecturersInContestsBusinessService,
        IContestsActivityService activityService)
    {
        this.lecturersInContestsBusinessService = lecturersInContestsBusinessService;
        this.activityService = activityService;
    }

    public ValidationResult GetValidationResult(
        (Problem?, Participant?, int, bool, bool, SubmitSubmissionServiceModel)
            validationInput)
    {
        var (problem, participant,
                userSubmissionTimeLimit, hasUserNotProcessedSubmissionForProblem,
                hasUserNotProcessedSubmissionForContest, submitSubmissionServiceModel) =
            validationInput;

        if (problem == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.NotFound);
        }

        if (participant == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NotRegisteredForContest);
        }

        if (participant.IsInvalidated)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.ParticipantIsInvalidated);
        }

        var problemId = problem.Id.ToString();

        var isAdminOrLecturer = this.lecturersInContestsBusinessService
            .IsCurrentUserAdminOrLecturerInContest(participant?.Contest.Id)
            .GetAwaiter()
            .GetResult();

        if (participant != null &&
            !isAdminOrLecturer &&
            !this.activityService.CanUserSubmit(participant.Contest.Map<ContestForActivityServiceModel>()))
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.UserCannotSubmit,
                problemId);
        }

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