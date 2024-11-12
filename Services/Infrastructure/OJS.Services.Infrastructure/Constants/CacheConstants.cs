namespace OJS.Services.Infrastructure.Constants
{
    public static class CacheConstants
    {
        public const int OneHourInSeconds = 60 * 60;
        public const int OneDayInSeconds = 86400;
        public const int TwoMinutesInSeconds = 120;
        public const int FiveMinutesInSeconds = 300;

        public const string MainContestCategoriesDropDown = "MainContestCategoriesDropDown";
        public const string ParticipantsCountByContest = "ParticipantsCountByContest:{0}";
        public const string ParticipantsCountByContestsPage = "ParticipantsCountByContestsPage:{0}:{1}";
        public const string ContestById = "Contest:{0}";
        public const string ContestCategoriesTree = "ContestCategoriesTree";
        public const string ContestCategoryDetails = "ContestCategoryDetails:{0}";

        public const string ContestSubCategoriesFormat = "ContestSubCategories:{0}";

        public const string TotalSubmissionsCount = "TotalSubmissionsCount";
        public const string LatestPublicSubmissions = "PublicSubmissions";

        public const string SubmissionTypesByUsage = "SubmissionTypesByUsage";
        public const string SubmissionTypeById = "SubmissionType:{0}";

        public const string CheckerById = "Checker:{0}";

        public const string ProblemsByContestId = "ProblemsByContestId:{0}";
        public const string TestsByProblemId = "TestsByProblemId:{0}";
    }
}