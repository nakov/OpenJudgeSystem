namespace OJS.Services.Administration.Business.Contests;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure.Exceptions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ContestsBusinessService : AdministrationOperationService<Contest, int, ContestAdministrationModel>, IContestsBusinessService
{
    private const int NumberOfContestsToGet = 20;
    private readonly IContestsDataService contestsData;
    private readonly Business.IUserProviderService userProvider;
    private readonly IIpsDataService ipsData;
    private readonly IContestsActivityService activityService;
    private readonly IParticipantsDataService participantsData;

    public ContestsBusinessService(
        IContestsDataService contestsData,
        Business.IUserProviderService userProvider,
        IIpsDataService ipsData,
        IContestsActivityService activityService,
        IParticipantsDataService participantsData)
    {
        this.contestsData = contestsData;
        this.userProvider = userProvider;
        this.ipsData = ipsData;
        this.activityService = activityService;
        this.participantsData = participantsData;
    }

    public async Task<bool> UserHasContestPermissions(
        int contestId,
        string? userId,
        bool isUserAdmin)
        => !string.IsNullOrWhiteSpace(userId) &&
           (isUserAdmin || await this.contestsData.IsUserLecturerInContestByContestAndUser(contestId, userId));

    public async Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>(string searchString)
        where TServiceModel : class
    {
        var user = this.userProvider.GetCurrentUser();

        return user.IsAdmin
            ? await this.contestsData.AllTo<TServiceModel>(
                filter: c => c.Name!.Contains(searchString),
                null,
                false,
                0,
                NumberOfContestsToGet)
            : await this.contestsData.GetAllByLecturer(user.Id)
                .Where(x => x.Name!.Contains(searchString))
                .Take(NumberOfContestsToGet)
                .MapCollection<TServiceModel>()
                .ToListAsync();
    }

    public override async Task<ContestAdministrationModel> Get(int id)
        => await this.contestsData.GetByIdWithProblems(id).Map<ContestAdministrationModel>();

    public override async Task<ContestAdministrationModel> Edit(ContestAdministrationModel model)
    {
        var contest = await this.contestsData.GetByIdQuery(model.Id)
            .Include(c => c.ProblemGroups)
            .FirstOrDefaultAsync();

        if (!model.IsOnlineExam && model.Duration != null)
        {
            model.Duration = null;
        }

        var originalContestPassword = contest!.ContestPassword;
        var originalPracticePassword = contest!.PracticePassword;

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
        return model;
    }

    public override async Task Delete(int id)
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

    public override async Task<ContestAdministrationModel> Create(ContestAdministrationModel model)
    {
        var contest = model.Map<Contest>();

        if (model.IsOnlineExam && model.NumberOfProblemGroups == 0)
        {
            AddProblemGroupsToContest(contest, model.NumberOfProblemGroups);
        }

        await this.AddIpsToContest(contest, model.AllowedIps);

        await this.contestsData.Add(contest);
        await this.contestsData.SaveChanges();
        return model;
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
            await this.participantsData.InvalidateByContestAndIsOfficial(contest.Id, isOfficial: true);
        }

        if (originalPracticePassword != contest.PracticePassword &&
            !string.IsNullOrWhiteSpace(contest.PracticePassword))
        {
            await this.participantsData.InvalidateByContestAndIsOfficial(contest.Id, isOfficial: false);
        }
    }

    private async Task<bool> IsContestActive(Contest contest)
    {
        var isActive = await this.activityService.IsContestActive(contest.Map<ContestForActivityServiceModel>());

        return isActive;
    }
}