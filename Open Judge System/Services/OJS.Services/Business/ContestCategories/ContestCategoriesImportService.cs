namespace OJS.Services.Business.ContestCategories
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using OJS.Data.Models;
    using OJS.Services.Business.Contests;
    using OJS.Services.Business.Contests.Models;
    using OJS.Services.Common.HttpRequester;

    public class ContestCategoriesImportService : IContestCategoriesImportService
    {
        private readonly IContestsImportService contestsImportService;
        private readonly IHttpRequesterService httpRequester;

        public ContestCategoriesImportService(
            IContestsImportService contestsImportService,
            IHttpRequesterService httpRequester)
        {
            this.contestsImportService = contestsImportService;
            this.httpRequester = httpRequester;
        }

        public async Task<string> ImportContestsIntoCategory(
            int categoryId,
            string ojsPlatformUrl,
            bool replace,
            string apiKey,
            params int[] contestIds)
        {
            var contestImportResults = new List<ContestImportResult>();

            foreach (var contestId in contestIds)
            {
                var url = $"{ojsPlatformUrl}/api/contests/export/{contestId}";
                var externalContestResult = await this.httpRequester.GetAsync<Contest>(null, url, apiKey);

                if (!externalContestResult.IsSuccess)
                {
                    contestImportResults.Add(new ContestImportResult
                    {
                        IsSuccess = false,
                        ErrorMessage = externalContestResult.ErrorMessage,
                        ContestImportedFromId = contestId,
                    });

                    continue;
                }

                var result = this.contestsImportService.ImportContest(externalContestResult.Data, categoryId, replace);
                contestImportResults.Add(result);
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