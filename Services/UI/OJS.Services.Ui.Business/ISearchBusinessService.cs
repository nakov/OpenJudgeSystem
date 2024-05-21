namespace OJS.Services.Ui.Business;

using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Models.Contests;
using OJS.Services.Ui.Models.Search;
using System.Threading.Tasks;

public interface ISearchBusinessService : IService
{
    Task<PagedResult<ContestForListingServiceModel>> GetContestSearchResults(SearchServiceModel model);

    Task<PagedResult<ProblemSearchServiceModel>> GetProblemSearchResults(SearchServiceModel model);

    Task<PagedResult<UserSearchServiceModel>> GetUserSearchResults(SearchServiceModel model);
}