namespace OJS.Services.Ui.Models.Submissions;

public enum SubmitSubmissionValidation
{
    UserNotLoggedIn = 0,
    ProblemNotFound = 1,
    NotRegisteredForExam = 2,
    ProblemNotAssignedToUser = 3,
    SubmissionTypeNotFound = 4,
    BinaryFilesNotAllowed = 5,
    TextUploadNotAllowed = 6,
    SubmissionWasSentTooSoon = 7,
    SubmissionTooLong = 8,
    UserHasNotProcessedSubmissionForProblem = 9,
    SubmissionTooShort = 10,
}