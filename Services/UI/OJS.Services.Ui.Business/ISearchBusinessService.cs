namespace OJS.Services.Ui.Business;

using OJS.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Models.Search;

public interface ISearchBusinessService : IService
{
    Task<PagedResult<ContestSearchServiceModel>> GetContestSearchResults(SearchServiceModel model);

    Task<PagedResult<ProblemSearchServiceModel>> GetProblemSearchResults(SearchServiceModel model);

    Task<PagedResult<UserSearchServiceModel>> GetUserSearchResults(SearchServiceModel model);
}