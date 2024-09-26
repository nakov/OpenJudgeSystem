namespace OJS.Services.Business.ContestCategories
{
    using System;
    using System.Collections.Generic;
    using OJS.Services.Business.Contests;
    using OJS.Services.Business.Contests.Models;

    public class ContestCategoriesImportService : IContestCategoriesImportService
    {
        private readonly IContestsImportService contestsImportService;

        public ContestCategoriesImportService(IContestsImportService contestsImportService)
        {
            this.contestsImportService = contestsImportService;
        }

        public IEnumerable<ContestImportResult> ImportContestsIntoCategory(
            int categoryId,
            string ojsPlatformUrl,
            bool replace,
            params int[] contestIds)
        {
            var contestImportResults = new List<ContestImportResult>();
            foreach (var contestId in contestIds)
            {
                try
                {
                    var result = this.contestsImportService.ImportContest(contestId, categoryId, ojsPlatformUrl, replace);
                    contestImportResults.Add(result);
                }
                catch (Exception e)
                {
                    contestImportResults.Add(new ContestImportResult
                    {
                        IsSuccess = false,
                        ErrorMessage = e.Message,
                        ContestImportedFromId = contestId,
                    });
                }
            }

            return contestImportResults;
        }
    }
}