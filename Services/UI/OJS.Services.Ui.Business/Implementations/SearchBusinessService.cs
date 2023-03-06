namespace OJS.Services.Ui.Business.Implementations;

using System;
using System.Threading.Tasks;
using Models.Search;
using SoftUni.Common.Models;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using Validation;

public class SearchBusinessService : ISearchBusinessService
{
    private const int DefaultItemsPerPage = 8;

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

    public async Task<PagedResult<SearchForListingServiceModel>> GetSearchResults(
        SearchServiceModel? model)
    {
        model ??= new SearchServiceModel();
        model.ItemsPerPage ??= DefaultItemsPerPage;
        model.SearchTerm = model.SearchTerm?.Trim();

        var validationResult = this.searchValidationService.GetValidationResult(model.SearchTerm);

        var searchListingModel = new SearchForListingServiceModel();
        if (validationResult.IsValid)
        {
            await this.PopulateProperValues(model, searchListingModel);
        }

        searchListingModel.ValidationResult = validationResult;

        var modelResult = model.Map<PagedResult<SearchForListingServiceModel>>();
        modelResult.Items = new[]
            {
                searchListingModel,
            };

        return modelResult;
    }

    private static int CalculateMaxItemsCount(int usersCount, int contestsCount, int problemsCount)
        => Math.Max(Math.Max(usersCount, contestsCount), problemsCount);

    private async Task PopulateProperValues(SearchServiceModel model, SearchForListingServiceModel searchListingModel)
    {
        if (model.SelectedTerm == SearchSelectType.All)
        {
            var (users, usersCount) = await this.usersBusinessService.GetSearchUsersByUsername<UserSearchServiceModel>(model);
            var (contests, contestsCount) = await this.contestsBusinessService.GetSearchContestsByName<ContestSearchServiceModel>(model);
            var (problems, problemsCount) = await this.problemsBusinessService.GetSearchProblemsByName(model);

            searchListingModel.Contests = contests;
            searchListingModel.Problems = problems;
            searchListingModel.Users = users;

            model.TotalItemsCount = CalculateMaxItemsCount(usersCount, contestsCount, problemsCount);
        }
        else if (model.SelectedTerm == SearchSelectType.Contests)
        {
            var (contests, contestsCount) = await this.contestsBusinessService.GetSearchContestsByName<ContestSearchServiceModel>(model);

            searchListingModel.Contests = contests;

            model.TotalItemsCount = contestsCount;
        }
        else if (model.SelectedTerm == SearchSelectType.Problems)
        {
            var (problems, problemsCount) = await this.problemsBusinessService.GetSearchProblemsByName(model);

            searchListingModel.Problems = problems;

            model.TotalItemsCount = problemsCount;
        }
        else if (model.SelectedTerm == SearchSelectType.Users)
        {
            var (users, usersCount) = await this.usersBusinessService.GetSearchUsersByUsername<UserSearchServiceModel>(model);

            searchListingModel.Users = users;

            model.TotalItemsCount = usersCount;
        }
    }
}