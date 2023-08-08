namespace OJS.Common.Constants
{
    public static class CacheConstants
    {
        public const int OneHourInSeconds = 60 * 60;
        public const int OneDayInSeconds = 86400;

        public const string MainContestCategoriesDropDown = "MainContestCategoriesDropDown";
        public const string ContestCategoriesTree = "ContestCategoriesTree";
        public const string ContestSubCategoriesFormat = "ContestSubCategories:id:{0}";
        public const string ContestParentCategoriesFormat = "ContestParentCategories:id:{0}";
        public const string ContestCategoryNameFormat = "ContestCategoryName:id:{0}";

        public const string SubmissionsCountByMonthsForPastElevenMonthsKey = "Submissions:count:by:month:for:past:eleven:months";
        public const string SubmissionsCountForLastMonthKey = "Submissions:count:by:month:for:last:month";

        public const string ActiveContests = "ActiveContests";
        public const string PastContests = "PastContests";

        public const int DefaultPastContestsToTake = 15;

        public static readonly string ContestResultsFormat = "Contest:id:{0}:official:{1}:full:{2}:export{3}";

        public static readonly string ContestView = "Contest:{0}";

        public static readonly string ResultsByProblem = "Results:By:Problem:id:{0}:official:{1}";

        public static readonly string KeysPrefix = "OJS:";
    }
}