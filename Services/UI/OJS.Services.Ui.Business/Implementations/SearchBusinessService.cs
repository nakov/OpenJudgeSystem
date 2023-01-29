namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;
using OJS.Services.Ui.Models.Search;
using OJS.Services.Infrastructure.Exceptions;

public class SearchBusinessService : ISearchBusinessService
{
    private const int MinimumTermLength = 3;

    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly IUsersBusinessService usersBusinessService;

    public SearchBusinessService(
        IContestsBusinessService contestsBusinessService,
        IProblemsBusinessService problemsBusinessService,
        IUsersBusinessService usersBusinessService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.problemsBusinessService = problemsBusinessService;
        this.usersBusinessService = usersBusinessService;
    }

    public async Task<SearchServiceModel> GetSearchResults(string searchTerm)
    {
        this.ValidateSearchInput(searchTerm);

        var trimmedSearch = searchTerm.Trim();

        var users = await this.usersBusinessService.GetSearchUsersByUsername(trimmedSearch);
        var contests = await this.contestsBusinessService.GetSearchContestsByName(trimmedSearch);
        var problems = await this.problemsBusinessService.GetSearchProblemsByName(trimmedSearch);

        return new SearchServiceModel { Users = users, Contests = contests, Problems = problems };
    }

    public void ValidateSearchInput(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm) && searchTerm.Length < MinimumTermLength)
        {
            throw new BusinessServiceException("The search term must be at least 3 characters.");
        }
    }
}