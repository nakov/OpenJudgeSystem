namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;
using OJS.Services.Ui.Models.Search;
using OJS.Services.Ui.Business.Validation;

public class SearchBusinessService : ISearchBusinessService
{
    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly IUsersBusinessService usersBusinessService;
    private readonly ISearchValidationService searchValidationService;

    public SearchBusinessService(
        IContestsBusinessService contestsBusinessService,
        IProblemsBusinessService problemsBusinessService,
        IUsersBusinessService usersBusinessService,
        ISearchValidationService searchValidationService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.problemsBusinessService = problemsBusinessService;
        this.usersBusinessService = usersBusinessService;
        this.searchValidationService = searchValidationService;
    }

    public async Task<SearchServiceModel> GetSearchResults(string? searchTerm)
    {
        var searchSearchModel = new SearchServiceModel();

        var trimmedSearch = searchTerm?.Trim();

        var validationResult = this.searchValidationService.GetValidationResult(trimmedSearch);

        var users = await this.usersBusinessService.GetSearchUsersByUsername(trimmedSearch!);
        var contests = await this.contestsBusinessService.GetSearchContestsByName(trimmedSearch!);
        var problems = await this.problemsBusinessService.GetSearchProblemsByName(trimmedSearch!);

        searchSearchModel.ValidationResult = validationResult;
        searchSearchModel.Users = users;
        searchSearchModel.Contests = contests;
        searchSearchModel.Problems = problems;

        return searchSearchModel;
    }
}