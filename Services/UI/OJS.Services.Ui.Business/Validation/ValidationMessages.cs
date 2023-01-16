namespace OJS.Services.Ui.Business.Validation;

public static class ValidationMessages
{
    public static class Contest
    {
        public const string NotFound = "Contest not found!";

        public const string IsExpired = "Contest is expired!";

        public const string CanBeCompeted = "Contest can't be competed!";

        public const string CanBePracticed = "Contest can't be practiced!";
    }

    public static class User
    {
        public const string NotLoggedIn = "You need to log in first!";
    }

    public static class Submission
    {
        public const string NotFound = "Submission not found!";

        public const string NotMadeByUser = "You can only view your own submissions!";
    }
}