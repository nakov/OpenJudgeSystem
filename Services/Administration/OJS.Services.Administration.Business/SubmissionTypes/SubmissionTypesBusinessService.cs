namespace OJS.Services.Administration.Business.SubmissionTypes;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using static OJS.Common.GlobalConstants.Roles;

public class SubmissionTypesBusinessService : AdministrationOperationService<SubmissionType, int, SubmissionTypeAdministrationModel>, ISubmissionTypesBusinessService
{
    private readonly ISubmissionTypesDataService submissionTypesDataService;
    private readonly IContestsDataService contestsDataService;
    private readonly ISubmissionsDataService submissionsDataService;
    private readonly IParticipantScoresDataService participantScoresData;
    private readonly ITestRunsDataService testRunsData;
    private readonly ISubmissionTypesInProblemsDataService submissionTypesInProblemsDataService;
    private readonly IDatesService datesService;

    public SubmissionTypesBusinessService(
        ISubmissionTypesDataService submissionTypesDataService,
        IContestsDataService contestsDataService,
        ISubmissionsDataService submissionsDataService,
        IParticipantScoresDataService participantScoresData,
        ITestRunsDataService testRunsData,
        ISubmissionTypesInProblemsDataService submissionTypesInProblemsDataService,
        IDatesService datesService)
    {
        this.submissionTypesDataService = submissionTypesDataService;
        this.contestsDataService = contestsDataService;
        this.submissionsDataService = submissionsDataService;
        this.participantScoresData = participantScoresData;
        this.testRunsData = testRunsData;
        this.submissionTypesInProblemsDataService = submissionTypesInProblemsDataService;
        this.datesService = datesService;
    }

    public async Task<List<SubmissionTypesInProblemView>> GetForProblem() =>
        await this.submissionTypesDataService.GetAll().MapCollection<SubmissionTypesInProblemView>().ToListAsync();

    public async Task<string> ReplaceSubmissionType(ReplaceSubmissionTypeServiceModel model)
    {
        var stringBuilder = new StringBuilder();

        if (model.SubmissionTypeToReplaceWith.HasValue && model.SubmissionTypeToReplace == model.SubmissionTypeToReplaceWith.Value)
        {
            throw new BusinessServiceException("Cannot replace submission type with identical submission type");
        }

        var submissionType = await this.submissionTypesDataService
            .GetByIdQuery(model.SubmissionTypeToReplace)
            .FirstOrDefaultAsync();

        if (submissionType == null)
        {
            throw new BusinessServiceException($"Submission type {model.SubmissionTypeToReplace} does not exist");
        }

        var administratorRoles = new string[] { Administrator, Lecturer, Developer };

        var submissionsByRegularUsersInTheLastMonth = await this.submissionsDataService
            .GetQuery()
            .Include(s => s.Participant)
            .ThenInclude(p => p.User)
            .ThenInclude(u => u.UsersInRoles)
            .Where(s => s.SubmissionTypeId == submissionType.Id &&
                        s.CreatedOn > this.datesService.GetUtcNow().AddMonths(-1) &&
                        !s.Participant.User.UsersInRoles.Any(ur => administratorRoles.Contains(ur.Role.Name)))
            .ToListAsync();

        if (submissionsByRegularUsersInTheLastMonth.Count > 0)
        {
            throw new BusinessServiceException(
                "This submission type has been used in the last month and cannot be considered as deprecated. Try again later.");
        }

        SubmissionType? submissionTypeToReplaceWith = null;

        bool shouldDoSubmissionsDeletion = !model.SubmissionTypeToReplaceWith.HasValue;

        if (!shouldDoSubmissionsDeletion)
        {
            // We delete submissions only when SubmissionTypeToReplaceWith is not provided
            submissionTypeToReplaceWith = await this.submissionTypesDataService
                .GetByIdQuery(model.SubmissionTypeToReplaceWith!.Value)
                .FirstOrDefaultAsync();

            if (submissionTypeToReplaceWith == null)
            {
                throw new BusinessServiceException("Submission type to replace with not found");
            }
        }

        var contests = await this.contestsDataService
            .GetAllVisible()
            .Include(c => c.ProblemGroups)
            .ThenInclude(pg => pg.Problems)
            .ThenInclude(p => p.SubmissionTypesInProblems)
            .Where(c => c.ProblemGroups
                .Any(pg => pg.Problems
                    .Any(p => p.SubmissionTypesInProblems.Any(st => st.SubmissionTypeId == model.SubmissionTypeToReplace))))
            .ToListAsync();

        if (shouldDoSubmissionsDeletion)
        {
            stringBuilder.Append(
                $"Submission type \"{submissionType.Name}\" will be deleted and all submissions associated with it");
            stringBuilder.AppendLine();

            AppendProblemsLeftWithNoSubmissionTypeText(stringBuilder, contests, submissionType);
        }
        else
        {
            stringBuilder.Append(
                $"Submission type \"{submissionType.Name}\" will be deleted and replaced with \"{submissionTypeToReplaceWith!.Name}\"");
        }

        var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        foreach (var contest in contests)
        {
            var problemsInContestContainingSubmissionTypeToReplace = contest.ProblemGroups
                .Where(pg => pg.Problems
                    .Any(p => p.SubmissionTypesInProblems
                        .Any(st => st.SubmissionTypeId == model.SubmissionTypeToReplace)))
                .SelectMany(pg => pg.Problems);

            foreach (var problem in problemsInContestContainingSubmissionTypeToReplace)
            {
                var submissions = this.submissionsDataService
                    .GetAllByProblem(problem.Id)
                    .Where(s => s.SubmissionTypeId == submissionType.Id);

                if (!shouldDoSubmissionsDeletion)
                {
                    submissions.ForEach(s =>
                    {
                        s.SubmissionTypeId = submissionTypeToReplaceWith!.Id;
                        s.ProcessingComment = $"{s.ProcessingComment}{Environment.NewLine}The submission type of this submission was updated from {submissionType.Name} to {submissionTypeToReplaceWith.Name} and changes to the problem or submission might be needed for correct execution.";

                        this.submissionsDataService.Update(s);
                    });

                    var alreadyContainsSubmissionTypeToReplace = problem
                        .SubmissionTypesInProblems
                        .Any(s => s.SubmissionTypeId == model.SubmissionTypeToReplaceWith!.Value);

                    if (!alreadyContainsSubmissionTypeToReplace)
                    {
                        await this.submissionTypesInProblemsDataService.Add(new SubmissionTypeInProblem
                        {
                            Problem = problem,
                            SubmissionType = submissionTypeToReplaceWith!,
                        });
                    }
                }
                else
                {
                    var submissionIds = submissions.Select(s => s.Id);

                    var participantScores = this.participantScoresData
                        .GetAllByProblem(problem.Id)
                        .Where(ps => submissionIds.Contains(ps.SubmissionId!.Value))
                        .ToList();

                    await this.participantScoresData.Delete(participantScores);
                    await this.testRunsData.DeleteBySubmissions(submissionIds);

                    this.submissionsDataService.DeleteMany(submissions);
                }
            }
        }

        this.submissionTypesDataService.Delete(submissionType);

        await this.submissionTypesDataService.SaveChanges();

        scope.Complete();
        scope.Dispose();

        return stringBuilder.ToString();
    }

    public override async Task<SubmissionTypeAdministrationModel> Get(int id) =>
         await this.submissionTypesDataService
             .GetByIdQuery(id)
             .MapCollection<SubmissionTypeAdministrationModel>()
             .FirstAsync();

    public override async Task<SubmissionTypeAdministrationModel> Create(SubmissionTypeAdministrationModel model)
    {
        var submissionType = model.Map<SubmissionType>();
        await this.submissionTypesDataService.Add(submissionType);
        await this.submissionTypesDataService.SaveChanges();

        return model;
    }

    public override async Task<SubmissionTypeAdministrationModel> Edit(SubmissionTypeAdministrationModel model)
    {
        var submissionType =
            await this.submissionTypesDataService
                .GetByIdQuery(model.Id)
                .Include(st => st.SubmissionTypesInProblems)
                .FirstOrDefaultAsync();

        if (submissionType == null)
        {
            throw new BusinessServiceException("Submission type not found.");
        }

        submissionType.MapFrom(model);
        this.submissionTypesDataService.Update(submissionType);
        await this.submissionTypesDataService.SaveChanges();

        return model;
    }

    public override async Task Delete(int id)
    {
        await this.submissionTypesDataService.DeleteById(id);
        await this.submissionTypesDataService.SaveChanges();
    }

    private static void AppendProblemsLeftWithNoSubmissionTypeText(
        StringBuilder stringBuilder,
        List<Contest> contests,
        SubmissionType submissionTypeToReplace)
    {
        var problemsWithOneSubmissionType = contests
            .SelectMany(c => c.ProblemGroups
                .SelectMany(pg => pg.Problems
                    .Where(p => p.SubmissionTypesInProblems
                        .Select(stp => stp.SubmissionTypeId)
                        .Contains(submissionTypeToReplace.Id) && p.SubmissionTypesInProblems.Count == 1))
                .Select(p => new { ContestId = c.Id, ContestName = c.Name, ProblemName = p.Name, }));

        if (contests.Count >= 1)
        {
            stringBuilder.Append("The following Contests are left with Problems without a submission type:");
            stringBuilder.AppendLine();
        }

        foreach (var group in problemsWithOneSubmissionType.GroupBy(x => x.ContestName))
        {
            stringBuilder.Append($"Contest #{group.First().ContestId}: {group.Key}");
            stringBuilder.AppendLine();

            foreach (var problem in group)
            {
                stringBuilder.Append($"- Problem: {problem.ProblemName}");
                stringBuilder.AppendLine();
            }

            stringBuilder.AppendLine();
        }
    }
}