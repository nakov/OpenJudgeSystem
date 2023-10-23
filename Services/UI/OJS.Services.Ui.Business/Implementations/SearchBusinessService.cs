namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;
using System.Linq;
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
        NormalizeSearchModel(model);

        var validationResult = this.searchValidationService.GetValidationResult(model.SearchTerm);

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var searchListingModel = new SearchForListingServiceModel();

        await this.PopulateSelectedConditionValues(model, searchListingModel);

        var modelResult = model.Map<PagedResult<SearchForListingServiceModel>>();
        modelResult.Items = new[] { searchListingModel, };

        return modelResult;
    }

    public async Task<PagedResult<ContestSearchForListingServiceModel>> GetContestSearchResults(
        SearchServiceModel model)
    {
        NormalizeSearchModel(model);

        var validationResult = this.searchValidationService.GetValidationResult(model.SearchTerm);

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var contestSearchListingModel = new ContestSearchForListingServiceModel();
        await this.PopulateSelectedConditionValues(model, contestSearchListingModel);

        var modelResult = model.Map<PagedResult<ContestSearchForListingServiceModel>>();
        modelResult.Items = new[] { contestSearchListingModel, };

        return modelResult;
    }

    public async Task<PagedResult<ProblemSearchForListingServiceModel>> GetProblemSearchResults(
        SearchServiceModel model)
    {
        NormalizeSearchModel(model);

        var validationResult = this.searchValidationService.GetValidationResult(model.SearchTerm);

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var problemsSearchListingModel = new ProblemSearchForListingServiceModel();
        await this.PopulateSelectedConditionValues(model, problemsSearchListingModel);

        var modelResult = model.Map<PagedResult<ProblemSearchForListingServiceModel>>();
        modelResult.Items = new[] { problemsSearchListingModel, };

        return modelResult;
    }

    public async Task<PagedResult<UserSearchForListingServiceModel>> GetUserSearchResults(
        SearchServiceModel model)
    {
        NormalizeSearchModel(model);

        var validationResult = this.searchValidationService.GetValidationResult(model.SearchTerm);

        if (!validationResult.IsValid)
        {
            throw new BusinessServiceException(validationResult.Message);
        }

        var usersSearchListingModel = new UserSearchForListingServiceModel();
        await this.PopulateSelectedConditionValues(model, usersSearchListingModel);

        var modelResult = model.Map<PagedResult<UserSearchForListingServiceModel>>();
        modelResult.Items = new[] { usersSearchListingModel, };

        return modelResult;
    }

    private static void NormalizeSearchModel(SearchServiceModel model)
    {
        model.SearchTerm = model.SearchTerm?.Trim();
        model.ItemsPerPage = DefaultItemsPerPage;
    }

    private async Task PopulateSelectedConditionValues(
        SearchServiceModel model,
        object searchListingModel)
    {
        if (searchListingModel is ContestSearchForListingServiceModel contestListingModel)
        {
            var contestsResult = await this.contestsBusinessService.GetSearchContestsByName(model);
            contestListingModel.Contests = contestsResult.Contests;
            model.TotalItemsCount = contestListingModel.Contests.Count();
        }

        if (searchListingModel is ProblemSearchForListingServiceModel problemListingModel)
        {
            var problemsResult = await this.problemsBusinessService.GetSearchProblemsByName(model);
            problemListingModel.Problems = problemsResult.Problems;
            model.TotalItemsCount = problemListingModel.Problems.Count();
        }

        if (searchListingModel is UserSearchForListingServiceModel userListingModel)
        {
            var usersResult = await this.usersBusinessService.GetSearchUsersByUsername(model);
            userListingModel.Users = usersResult.Users;
            model.TotalItemsCount = userListingModel.Users.Count();
        }
    }
}