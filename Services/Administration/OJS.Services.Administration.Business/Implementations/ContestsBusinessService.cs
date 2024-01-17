namespace OJS.Services.Administration.Business.Implementations;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Administration.Models.Contests;
using System;
using OJS.Services.Administration.Models.Problems;
using OJS.Data.Models;
using OJS.Data.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure.Exceptions;

public class ContestsBusinessService : GridDataService<Contest>, IContestsBusinessService
{
    private readonly IContestsDataService contestsData;
    private readonly Business.IUserProviderService userProvider;
    private readonly IProblemsDataService problemsDataService;
    private readonly IIpsDataService ipsData;
    private readonly IContestsActivityService activityService;
    private readonly IParticipantsDataService participantsData;
    public ContestsBusinessService(
        IContestsDataService contestsData,
        Business.IUserProviderService userProvider,
        IProblemsDataService problemsDataService,
        IIpsDataService ipsData,
        IContestsActivityService activityService,
        IParticipantsDataService participantsData)
        : base(contestsData)
    {
        this.contestsData = contestsData;
        this.userProvider = userProvider;
        this.problemsDataService = problemsDataService;
        this.ipsData = ipsData;
        this.activityService = activityService;
        this.participantsData = participantsData;
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

    public async Task<ContestAdministrationModel> ById(int id)
        => await this.contestsData.GetByIdWithProblems(id).Map<ContestAdministrationModel>();

    public async Task<IEnumerable<ContestViewProblemModel>> GetContestProblems(int id)
    {
        var contestProblems = await this.problemsDataService
            .GetAllByContest(id)
            .MapCollection<ContestViewProblemModel>()
            .ToListAsync();

        return contestProblems;
    }

    public async Task Edit(ContestAdministrationModel model, int id)
    {
        var contest = await this.contestsData.GetByIdQuery(id).FirstOrDefaultAsync();

        if (contest is null)
        {
            throw new ArgumentNullException($"Contest with Id:{id} not found");
        }

        model.Id = id;

        if (!model.IsOnlineExam && model.Duration != null)
        {
            model.Duration = null;
        }

        var originalContestPassword = contest.ContestPassword;
        var originalPracticePassword = contest.PracticePassword;

        contest.MapFrom(model);

        if (model.IsOnlineExam && contest.ProblemGroups.Count == 0)
        {
            AddProblemGroupsToContest(contest, model.NumberOfProblemGroups);
        }

        contest.IpsInContests.Clear();
        await this.AddIpsToContest(contest, model.AllowedIps);

        this.contestsData.Update(contest);
        await this.contestsData.SaveChanges();

        await this.InvalidateParticipants(originalContestPassword, originalPracticePassword, model);
    }

    public async Task Delete(int id)
    {
        var contest = await this.contestsData.GetByIdQuery(id).FirstOrDefaultAsync();
        if (contest is null)
        {
            throw new BusinessServiceException($"Contest with Id:{id} not found.");
        }

        if (await this.IsContestActive(contest))
        {
            throw new BusinessServiceException("Cannot delete active contest.");
        }

        this.contestsData.Delete(contest);
        await this.contestsData.SaveChanges();
    }

    private static void AddProblemGroupsToContest(Contest contest, int problemGroupsCount)
    {
        for (var i = 1; i <= problemGroupsCount; i++)
        {
            contest.ProblemGroups.Add(new ProblemGroup
            {
                OrderBy = i,
            });
        }
    }

    private async Task AddIpsToContest(Contest contest, string? mergedIps)
    {
        if (!string.IsNullOrWhiteSpace(mergedIps))
        {
            var ipValues = mergedIps.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var ipValue in ipValues)
            {
                var ip = await this.ipsData.GetByValue(ipValue) ?? new Ip { Value = ipValue };

                contest.IpsInContests.Add(new IpInContest { Ip = ip, IsOriginallyAllowed = true });
            }
        }
    }

    private async Task InvalidateParticipants(
        string? originalContestPassword,
        string? originalPracticePassword,
        ContestAdministrationModel contest)
    {
        if (originalContestPassword != contest.ContestPassword &&
            !string.IsNullOrWhiteSpace(contest.ContestPassword))
        {
            await this.participantsData.InvalidateByContestAndIsOfficial(contest.Id!.Value, isOfficial: true);
        }

        if (originalPracticePassword != contest.PracticePassword &&
            !string.IsNullOrWhiteSpace(contest.PracticePassword))
        {
            await this.participantsData.InvalidateByContestAndIsOfficial(contest.Id!.Value, isOfficial: false);
        }
    }

    private async Task<bool> IsContestActive(Contest contest)
    {
        var isActive = await this.activityService.IsContestActive(contest.Map<ContestForActivityServiceModel>());

        return isActive;
    }
}