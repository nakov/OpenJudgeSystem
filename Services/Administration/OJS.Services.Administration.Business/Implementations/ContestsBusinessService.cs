namespace OJS.Services.Administration.Business.Implementations;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Problems;
public class ContestsBusinessService : GridDataService<Contest>, IContestsBusinessService
{
    private readonly IContestsDataService contestsData;
    private readonly Business.IUserProviderService userProvider;
    private readonly IProblemsDataService problemsDataService;

    public ContestsBusinessService(
        IContestsDataService contestsData,
        Business.IUserProviderService userProvider,
        IProblemsDataService problemsDataService)
        : base(contestsData)
    {
        this.contestsData = contestsData;
        this.userProvider = userProvider;
        this.problemsDataService = problemsDataService;
    }

    public async Task<bool> UserHasContestPermissions(
        int contestId,
        string? userId,
        bool isUserAdmin)
        => !string.IsNullOrWhiteSpace(userId) &&
           (isUserAdmin || await this.contestsData.IsUserLecturerInByContestAndUser(contestId, userId));

    public async Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>()
        where TServiceModel : class
    {
        var user = this.userProvider.GetCurrentUser();

        return user.IsAdmin
            ? await this.contestsData.AllTo<TServiceModel>()
            : await this.contestsData.GetAllByLecturer(user.Id)
                .MapCollection<TServiceModel>()
                .ToListAsync();
    }

    public async Task<ContestResponseModel> ById(int id)
        => await this.contestsData.GetByIdWithProblems(id).Map<ContestResponseModel>();

    public async Task<IEnumerable<ContestViewProblemModel>> GetContestProblems(int id)
    {
        var contestProblems = await this.problemsDataService
            .GetAllByContest(id)
            .MapCollection<ContestViewProblemModel>()
            .ToListAsync();

        return contestProblems;
    }
}