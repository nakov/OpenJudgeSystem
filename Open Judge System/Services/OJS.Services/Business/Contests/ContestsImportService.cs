namespace OJS.Services.Business.Contests
{
    using OJS.Services.Business.Contests.Models;

    public class ContestsImportService : IContestsImportService
    {
        public ContestImportResult ImportContest(int contestIdToImport, int categoryIdToImportTo, string ojsPlatformUrl, bool replace)
        {
            return new ContestImportResult
            {
                IsSuccess = true,
                NewContestId = contestIdToImport,
                NewCategoryId = categoryIdToImportTo,
                ContestImportedFromId = contestIdToImport,
                CategoryImportedFromId = categoryIdToImportTo,
            };
        }
    }
}