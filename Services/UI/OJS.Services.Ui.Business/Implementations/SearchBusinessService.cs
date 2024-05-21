namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Common;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Business.Validations.Implementations.Search;
using OJS.Services.Ui.Models.Contests;
using OJS.Services.Ui.Models.Search;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SearchBusinessService : ISearchBusinessService
{
    private const int DefaultItemsPerPage = 8;

    private readonly IContestsBusinessService contestsBusinessService;
    private readonly IProblemsBusinessService problemsBusinessService;
    private readonly IUsersBusinessService usersBusinessService;
    private readonly IUserProviderService userProviderService;
    private readonly ISearchValidationService searchValidationService;
    private readonly IContestsActivityService activityService;

    public SearchBusinessService(
        IContestsBusinessService contestsBusinessService,
        IProblemsBusinessService problemsBusinessService,
        IUsersBusinessService usersBusinessService,
        IUserProviderService userProviderService,
        ISearchValidationService searchValidationService,
        IContestsActivityService activityService)
    {
        this.contestsBusinessService = contestsBusinessService;
        this.problemsBusinessService = problemsBusinessService;
        this.usersBusinessService = usersBusinessService;
        this.userProviderService = userProviderService;
        this.searchValidationService = searchValidationService;
        this.activityService = activityService;
    }

    public async Task<PagedResult<ContestForListingServiceModel>> GetContestSearchResults(
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

        var modelResult = model.Map<PagedResult<ContestForListingServiceModel>>();
        modelResult.Items = contestSearchListingModel.Contests;

        var participantResults = new Dictionary<int, List<ParticipantResultServiceModel>>();
        if (this.userProviderService.GetCurrentUser().IsAuthenticated)
        {
            participantResults = await this.contestsBusinessService
                .GetUserParticipantResultsForContestInPage(modelResult
                    .Items
                    .Select(c => c.Id)
                    .ToList());
        }

        return await this.contestsBusinessService.PrepareActivityAndResults(
            modelResult,
            participantResults);
    }

    public async Task<PagedResult<ProblemSearchServiceModel>> GetProblemSearchResults(
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

        var modelResult = model.Map<PagedResult<ProblemSearchServiceModel>>();
        modelResult.Items = problemsSearchListingModel.Problems;

        var contests = problemsSearchListingModel.Problems.Select(p => p.Contest).ToList();
        await this.activityService.SetCanBeCompetedAndPracticed(contests);

        return modelResult;
    }

    public async Task<PagedResult<UserSearchServiceModel>> GetUserSearchResults(
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

        var modelResult = model.Map<PagedResult<UserSearchServiceModel>>();
        modelResult.Items = usersSearchListingModel.Users;

        return modelResult;
    }

    private static void NormalizeSearchModel(SearchServiceModel model)
    {
        model.SearchTerm = model.SearchTerm?.Trim();

        if (model.ItemsPerPage <= 0)
        {
            model.ItemsPerPage = DefaultItemsPerPage;
        }
    }

    private async Task PopulateSelectedConditionValues(
        SearchServiceModel model,
        object searchListingModel)
    {
        if (searchListingModel is ContestSearchForListingServiceModel contestListingModel)
        {
            var contestsResult = await this.contestsBusinessService.GetSearchContestsByName(model);

            contestListingModel.Contests = contestsResult.Contests;

            model.TotalItemsCount = contestsResult.TotalContestsCount;
        }

        if (searchListingModel is ProblemSearchForListingServiceModel problemListingModel)
        {
            var problemsResult = await this.problemsBusinessService.GetSearchProblemsByName(model);

            problemListingModel.Problems = problemsResult.Problems;

            model.TotalItemsCount = problemsResult.TotalProblemsCount;
        }

        if (searchListingModel is UserSearchForListingServiceModel userListingModel)
        {
            var usersResult = await this.usersBusinessService.GetSearchUsersByUsername(model);

            userListingModel.Users = usersResult.Users;

            model.TotalItemsCount = usersResult.TotalUsersCount;
        }
    }
}