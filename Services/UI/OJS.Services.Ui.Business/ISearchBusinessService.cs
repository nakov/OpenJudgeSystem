namespace OJS.Services.Ui.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;
using SoftUni.Common.Models;
using Models.Search;

public interface ISearchBusinessService : IService
{
    Task<PagedResult<SearchForListingServiceModel>> GetSearchResults(SearchServiceModel model);
    Task<PagedResult<ContestSearchForListingServiceModel>> GetContestSearchResults(SearchServiceModel model);
    Task<PagedResult<ProblemSearchForListingServiceModel>> GetProblemSearchResults(SearchServiceModel model);
    Task<PagedResult<UserSearchForListingServiceModel>> GetUserSearchResults(SearchServiceModel model);
}