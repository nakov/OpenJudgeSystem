namespace OJS.Services.Ui.Business.Validations.Implementations.Submissions;

using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OJS.Data.Models.Participants;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Business.Validations.Implementations.Contests;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Cache;
using OJS.Services.Ui.Models.Submissions;

public class SubmitSubmissionValidationService : ISubmitSubmissionValidationService
{
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusiness;
    private readonly ISubmissionsDataService submissionsData;

    public SubmitSubmissionValidationService(
        ILecturersInContestsBusinessService lecturersInContestsBusiness,
        ISubmissionsDataService submissionsData)
    {
        this.lecturersInContestsBusiness = lecturersInContestsBusiness;
        this.submissionsData = submissionsData;
    }

    public async Task<ValidationResult> GetValidationResult(
        (ProblemForSubmitCacheModel?,
        Participant?,
        ParticipantActivityServiceModel?,
        SubmitSubmissionServiceModel,
        ContestCacheModel?,
        SubmissionType?) item)
    {
        var (problem, participant, participantActivity, submitSubmissionServiceModel, contest, submissionType) = item;

        if (problem == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.NotFound);
        }

        if (participant == null || participantActivity == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NotRegisteredForContest);
        }

        if (contest == null)
        {
            return ValidationResult.Invalid("Contest not found");
        }

        var isAdminOrLecturer = await this.lecturersInContestsBusiness
            .IsCurrentUserAdminOrLecturerInContest(contest.Id);

        if (participantActivity.IsInvalidated)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.ParticipantIsInvalidated);
        }

        if (!participantActivity.HasParticipationTimeLeft && !isAdminOrLecturer)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.ParticipationTimeEnded);
        }

        if (!participantActivity.IsActive && !isAdminOrLecturer)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.ParticipationNotActive);
        }

        var problemIdToString = problem.Id.ToString();

        var participantHasUnprocessedSubmissionForProblem =
            await this.submissionsData.HasParticipantNotProcessedSubmissionForProblem(problem.Id, participant.Id);

        if (participantHasUnprocessedSubmissionForProblem)
        {
            return ValidationResult.Invalid(
                ValidationMessages.Submission.UserHasNotProcessedSubmissionForProblem,
                problemIdToString);
        }

        if (!contest.AllowParallelSubmissionsInTasks &&
            await this.submissionsData.HasParticipantNotProcessedSubmissionForContest(contest.Id, participant.Id))
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

        if (submitSubmissionServiceModel.Official &&
            contest.IsOnlineExam &&
            !isAdminOrLecturer &&
            participant.ProblemsForParticipants.All(p => p.ProblemId != problem.Id))
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.ProblemNotAssignedToUser, problemIdToString);
        }

        if (submissionType == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionTypeNotFound, problemIdToString);
        }

        var isFileUpload = submitSubmissionServiceModel.StringContent == null || submitSubmissionServiceModel.ByteContent != null;

        if (isFileUpload && !submissionType.AllowedFileExtensions!.Contains(submitSubmissionServiceModel.FileExtension!))
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.InvalidExtension, problemIdToString);
        }

        if (isFileUpload && !submissionType.AllowBinaryFilesUpload)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.BinaryFilesNotAllowed, problemIdToString);
        }

        if (!isFileUpload && submissionType.AllowBinaryFilesUpload)
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

        var userSubmissionTimeLimit = await this.submissionsData.GetUserSubmissionTimeLimit(participant.Id, contest.LimitBetweenSubmissions);

        if (userSubmissionTimeLimit != 0)
        {
            return ValidationResult.Invalid(ValidationMessages.Submission.SubmissionWasSentTooSoon, problemIdToString);
        }

        return ValidationResult.Valid();
    }
}