namespace OJS.Services.Ui.Business.Implementations;

using System;
using System.Threading.Tasks;
using Models.Search;
using SoftUni.Common.Models;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using Infrastructure.Exceptions;
using OJS.Services.Ui.Business.Validations.Implementations.Search;

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
        SearchServiceModel model)
    {
        model.SearchTerm = model.SearchTerm?.Trim();

        var validationResult = this.searchValidationService.GetValidationResult(model.SearchTerm);

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var searchListingModel = new SearchForListingServiceModel();
        model.ItemsPerPage = DefaultItemsPerPage;

        await this.PopulateSelectedConditionValues(model, searchListingModel);

        var modelResult = model.Map<PagedResult<SearchForListingServiceModel>>();
        modelResult.Items = new[] { searchListingModel, };

        return modelResult;
    }

    private static int CalculateMaxItemsCount(int usersCount, int contestsCount, int problemsCount)
        => Math.Max(Math.Max(usersCount, contestsCount), problemsCount);

    private async Task PopulateSelectedConditionValues(
        SearchServiceModel model,
        SearchForListingServiceModel searchListingModel)
    {
        ContestSearchServiceResultModel contestsResult = new ();
        ProblemSearchServiceResultModel problemsResult = new ();
        UserSearchServiceResultModel usersResult = new ();

        if (model.Contests)
        {
            contestsResult = await this.contestsBusinessService.GetSearchContestsByName(model);

            searchListingModel.Contests = contestsResult.Contests;
        }

        if (model.Problems)
        {
            problemsResult = await this.problemsBusinessService.GetSearchProblemsByName(model);

            searchListingModel.Problems = problemsResult.Problems;
        }

        if (model.Users)
        {
            usersResult = await this.usersBusinessService.GetSearchUsersByUsername(model);

            searchListingModel.Users = usersResult.Users;
        }

        model.TotalItemsCount = CalculateMaxItemsCount(
            usersResult.TotalUsers,
            contestsResult.TotalContestsCount,
            problemsResult.TotalProblemsCount);
    }
}