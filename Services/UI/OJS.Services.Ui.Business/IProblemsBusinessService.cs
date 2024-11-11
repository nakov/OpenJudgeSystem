namespace OJS.Services.Ui.Business
{
    using System.Threading.Tasks;
    using OJS.Services.Ui.Models.Search;
    using OJS.Services.Infrastructure;

    public interface IProblemsBusinessService : IService
    {
        Task<ProblemSearchServiceResultModel> GetSearchProblemsByName(SearchServiceModel model);
    }
}