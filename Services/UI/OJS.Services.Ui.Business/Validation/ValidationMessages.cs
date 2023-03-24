namespace OJS.Services.Ui.Business.Validation;

public static class ValidationMessages
{
    public static class Contest
    {
        public const string NotFound = "{0} - Contest not found.";

        public const string IsExpired = "{0} - Contest is expired.";

        public const string CanBeCompeted = "{0} - Contest can't be competed.";

        public const string CanBePracticed = "{0} - Contest can't be practiced.";
    }

    public static class User
    {
        public const string NotLoggedIn = "You need to log in first.";
    }

    public static class Submission
    {
        public const string NotFound = "{0} - Submission not found.";

        public const string NotMadeByUser = "{0} - You can only view your own submissions.";

        public const string SubmissionTypeNotFound = "{0} - Wrong submission type.";

        public const string BinaryFilesNotAllowed = "{0} - This submission type does not allow sending binary files.";

        public const string TextUploadNotAllowed = "{0} - This submission type does not allow sending text.";

        public const string SubmissionWasSentTooSoon = "{0} - Submission was sent too soon.";

        public const string SubmissionTooLong = "{0} - The submitted code is too long.";

        public const string UserHasNotProcessedSubmissionForProblem = "{0} - You have unprocessed submission for this problem. Please wait until the submission is processed.";

        public const string SubmissionTooShort = "{0} - The submission must be at least 5 characters long.";

        public const string SubmissionEmpty = "{0} - Solution cannot be empty.";

        public const string InvalidExtension = "{0} - Invalid file extension.";

        public const string NotRegisteredForExam = "{0} - You are not registered for this exam.";

        public const string ProblemNotAssignedToUser = "{0} - The problem is not part of your problems for the exam.";
    }

    public static class Problem
    {
        public const string NotFound = "Problem not found.";

        public const string ProblemNotAssignedToUser = "The problem is not part of your problems for the exam.";

        public const string ProblemResultsNotAvailable = "You cannot view the results for this problem.";
    }

    public static class Participant
    {
        public const string NotRegisteredForExam = "You are not registered for this exam.";
    }
}