namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

public static class ValidationMessages
{
    public static class Contest
    {
        public const string NotFound = "Contest not found.";

        public const string IsExpired = "{0} - Contest is expired.";

        public const string CanBeCompeted = "Contest can't be competed.";

        public const string CanBePracticed = "Contest can't be practiced.";
    }

    public static class User
    {
        public const string NotLoggedIn = "You need to log in first.";

        public const string NotAdminOrLecturer = "You do not have permissions for this action.";
    }

    public static class Search
    {
        public const string LessThanThreeSymbols = "The search term must be at least 3 characters!";
    }

    public static class Submission
    {
        public const string NotFound = "Submission not found.";

        public const string NotMadeByUser = "You can only view your own submissions.";

        public const string UserCannotSubmit = "You cannot submit solutions in this contest.";

        public const string SubmissionTypeNotFound = "Wrong submission type.";

        public const string BinaryFilesNotAllowed = "This submission type does not allow sending binary files.";

        public const string TextUploadNotAllowed = "This submission type does not allow sending text.";

        public const string SubmissionWasSentTooSoon = "Submission was sent too soon.";

        public const string SubmissionFileTooBig = "The chosen file is too big. Please choose a smaller file.";

        public const string SubmissionTooLong = "The submitted code is too long. Please submit a shorter solution.";

        public const string UserHasNotProcessedSubmissionForProblem = "You have unprocessed submission for this problem. Please wait until the submission is processed.";

        public const string SubmissionTooShort = "The submission must be at least 5 characters long.";

        public const string SubmissionEmpty = "Solution cannot be empty.";

        public const string InvalidExtension = "Invalid file extension.";

        public const string NoContentToDownload = "There is no content to download.";

        public const string UserHasNotProcessedSubmissionForContest = "You have unprocessed submission for this contest. Please wait until the submission is processed.";

        public const string NoPrivilegesForThisSubmission = "You do not have priviledges for this submission";

        public const string NotEligibleForRetest = "Submission is not eligible for retest";
    }

    public static class Problem
    {
        public const string NotFound = "Problem not found.";

        public const string ProblemNotAssignedToUser = "The problem is not part of your problems for the exam.";
    }

    public static class Participant
    {
        public const string NotRegisteredForContest = "You are not registered for this contest.";

        public const string NotRegisteredForExam = "You are not registered for this exam.";

        public const string ParticipantIsInvalidated = "Participation for this contest is invalidated.";

        public const string ParticipationTimeEnded = "Participation time for this contest has expired.";

        public const string ParticipationNotActive = "Participation for this contest is not active.";

        public const string NoPrivilegesForContestResults = "You don't have privileges to view contest's full results.";

        public const string ResultsNotVisibleForContest = "Results for this contest are not available.";
    }
}