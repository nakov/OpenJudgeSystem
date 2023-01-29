namespace OJS.Services.Ui.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Services.Ui.Models.Search;

public interface ISearchBusinessService : IService
{
    Task<SearchServiceModel> GetSearchResults(string searchTerm);

    void ValidateSearchInput(string input);
}