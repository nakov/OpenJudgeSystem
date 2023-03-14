namespace OJS.Services.Ui.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;
using SoftUni.Common.Models;
using Models.Search;

public interface ISearchBusinessService : IService
{
    Task<PagedResult<SearchForListingServiceModel>> GetSearchResults(SearchServiceModel model);
}