namespace OJS.Services.Business.Contests
{
    using OJS.Data.Models;
    using OJS.Services.Business.Contests.Models;

    public class ContestsImportService : IContestsImportService
    {
        public ContestImportResult ImportContest(Contest contest, int categoryIdToImportTo, bool replace)
        {
            var contestIdToImport = contest.Id;

            // TODO: Implement the contest import logic here
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