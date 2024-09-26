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

        public string ImportContestsIntoCategory(
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

            var failedResults = contestImportResults.FindAll(r => !r.IsSuccess);
            var successfulResults = contestImportResults.FindAll(r => r.IsSuccess);
            var message = GenerateImportMessage(failedResults, successfulResults);
            return message;
        }

        private static string GenerateImportMessage(
            List<ContestImportResult> failedResults,
            List<ContestImportResult> successfulResults)
        {
            var message = string.Empty;
            if (failedResults.Count > 0)
            {
                message += Environment.NewLine + "The following contests failed to import: " +
                    string.Join(Environment.NewLine, failedResults.ConvertAll(r => $"{r.ContestImportedFromId} - {r.ErrorMessage}"));
            }

            if (successfulResults.Count > 0)
            {
                message += Environment.NewLine + "The following contests were imported successfully: " +
                    string.Join(", ", successfulResults.ConvertAll(r => r.ContestImportedFromId));
            }

            return message;
        }
    }
}