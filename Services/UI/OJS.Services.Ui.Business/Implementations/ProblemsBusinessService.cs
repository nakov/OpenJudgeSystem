namespace OJS.Services.Ui.Business.Implementations
{
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Services.Infrastructure;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Search;
    using OJS.Services.Infrastructure.Extensions;
    using X.PagedList;

    public class ProblemsBusinessService : IProblemsBusinessService
    {
        private readonly IProblemsDataService problemsData;
        private readonly IDatesService dates;

        public ProblemsBusinessService(
            IProblemsDataService problemsData,
            IDatesService dates)
        {
            this.problemsData = problemsData;
            this.dates = dates;
        }

        public async Task<ProblemSearchServiceResultModel> GetSearchProblemsByName(SearchServiceModel model)
        {
            var modelResult = new ProblemSearchServiceResultModel();

            var allProblemsQueryable = this.problemsData
                .GetAllNonDeletedProblems()
                .Where(p => p.Name.Contains(model.SearchTerm ?? string.Empty) &&
                            (p.ProblemGroup.Contest.IsVisible || p.ProblemGroup.Contest.VisibleFrom <= this.dates.GetUtcNow()) &&
                            (p.ProblemGroup.Contest.Category != null &&
                             p.ProblemGroup.Contest.Category.IsVisible));

            var searchProblems = await allProblemsQueryable
                .MapCollection<ProblemSearchServiceModel>()
                .ToPagedListAsync(model.PageNumber, model.ItemsPerPage);

            modelResult.Problems = searchProblems;
            modelResult.TotalProblemsCount = allProblemsQueryable.Count();

            return modelResult;
        }
    }
}