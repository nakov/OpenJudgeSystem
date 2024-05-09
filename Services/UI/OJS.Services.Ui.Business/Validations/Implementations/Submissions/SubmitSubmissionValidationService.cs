namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using System.Linq;
using System.Text;
using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Submissions;

public class SubmitSubmissionValidationService : ISubmitSubmissionValidationService
{
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusiness;
    private readonly IParticipantsBusinessService participantsBusiness;
    private readonly ISubmissionsDataService submissionsData;
    private readonly IContestsActivityService activityService;

    public SubmitSubmissionValidationService(
        ILecturersInContestsBusinessService lecturersInContestsBusiness,
        IParticipantsBusinessService participantsBusiness,
        ISubmissionsDataService submissionsData,
        IContestsActivityService activityService)
    {
        this.lecturersInContestsBusiness = lecturersInContestsBusiness;
        this.participantsBusiness = participantsBusiness;
        this.activityService = activityService;
        this.submissionsData = submissionsData;
    }

    public ValidationResult GetValidationResult((Problem?, Participant?, SubmitSubmissionServiceModel) validationInput)
    {
        var (problem, participant, submitSubmissionServiceModel) = validationInput;

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

        if (!this.participantsBusiness.IsActiveParticipant(participant))
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.ParticipationTimeEnded);
        }

        var problemIdToString = problem.Id.ToString();

        var userHasUnprocessedSubmissionForProblem =
            this.submissionsData.HasUserNotProcessedSubmissionForProblem(problem.Id, participant.UserId);

        var userHasUnprocessedSubmissionForContest =
            this.submissionsData.HasUserNotProcessedSubmissionForContest(participant.ContestId, participant.UserId);

        if (userHasUnprocessedSubmissionForProblem)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.UserHasNotProcessedSubmissionForProblem,
                problemIdToString);
        }

        if (!participant!.Contest.AllowParallelSubmissionsInTasks && userHasUnprocessedSubmissionForContest)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.UserHasNotProcessedSubmissionForContest,
                problemIdToString);
        }

        if (string.IsNullOrWhiteSpace(submitSubmissionServiceModel.StringContent) &&
            (submitSubmissionServiceModel.ByteContent == null || submitSubmissionServiceModel.ByteContent.Length == 0))
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionEmpty, problemIdToString);
        }

        var isAdminOrLecturer = this.lecturersInContestsBusiness
            .IsCurrentUserAdminOrLecturerInContest(participant?.Contest.Id)
            .GetAwaiter()
            .GetResult();

        if (submitSubmissionServiceModel.Official &&
            participant!.Contest.IsOnlineExam &&
            !isAdminOrLecturer &&
            participant.ProblemsForParticipants.All(p => p.ProblemId != problem.Id))
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.ProblemNotAssignedToUser, problemIdToString);
        }

        var submissionType = problem.SubmissionTypesInProblems.FirstOrDefault(st =>
                st.SubmissionTypeId == submitSubmissionServiceModel.SubmissionTypeId);

        if (submissionType == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTypeNotFound, problemIdToString);
        }

        var isFileUpload = submitSubmissionServiceModel.StringContent == null || submitSubmissionServiceModel.ByteContent != null;

        if (isFileUpload && !submissionType.SubmissionType.AllowedFileExtensions!.Contains(submitSubmissionServiceModel.FileExtension!))
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.InvalidExtension, problemIdToString);
        }

        if (isFileUpload && !submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.BinaryFilesNotAllowed, problemIdToString);
        }

        if (!isFileUpload && submissionType.SubmissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.TextUploadNotAllowed, problemIdToString);
        }

        if (submitSubmissionServiceModel.ByteContent != null &&
            problem.SourceCodeSizeLimit < submitSubmissionServiceModel.ByteContent.Length)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionFileTooBig, problemIdToString);
        }

        if (submitSubmissionServiceModel.StringContent != null &&
            problem.SourceCodeSizeLimit < Encoding.UTF8.GetBytes(submitSubmissionServiceModel.StringContent).Length)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTooLong, problemIdToString);
        }

        if (!isFileUpload && submitSubmissionServiceModel.StringContent!.Length < 5)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTooShort, problemIdToString);
        }

        var userSubmissionTimeLimit = this.submissionsData.GetUserSubmissionTimeLimit(participant!.Id, participant.Contest.LimitBetweenSubmissions);

        if (userSubmissionTimeLimit != 0)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionWasSentTooSoon, problemIdToString);
        }

        return ValidationResult.Valid();
    }
}