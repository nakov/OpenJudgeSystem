namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Submissions;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

public class SubmissionsController : BaseAutoCrudAdminController<Submission>
{
    public const string ContestIdKey = nameof(ProblemGroup.ContestId);
    public const string ProblemIdKey = nameof(Submission.ProblemId);
    public const string ParticipantIdKey = nameof(Submission.ParticipantId);

    protected override Expression<Func<Submission, bool>>? MasterGridFilter
        => GetMasterGridFilter();

    protected override IEnumerable<CustomGridColumn<Submission>> CustomColumns
        => new CustomGridColumn<Submission>[]
        {
            new()
            {
                Name = "Contest",
                ValueFunc = s => s.Problem != null ? s.Problem.ProblemGroup.Contest.ToString() : string.Empty,
            },
            new()
            {
                Name = "Contest Id",
                ValueFunc = s => s.Problem != null ? s.Problem!.ProblemGroup.ContestId.ToString() : string.Empty,
            },
        };

    private Expression<Func<Submission, bool>>? GetMasterGridFilter()
    {
        if (this.TryGetEntityIdForNumberColumnFilter(ContestIdKey, out var contestId))
        {
            return x => x.Problem != null && x.Problem.ProblemGroup.ContestId == contestId;
        }

        if (this.TryGetEntityIdForNumberColumnFilter(ProblemIdKey, out var problemId))
        {
            return x => x.ProblemId == problemId;
        }

        if (this.TryGetEntityIdForNumberColumnFilter(ParticipantIdKey, out var participantId))
        {
            return x => x.ParticipantId == participantId;
        }

        return base.MasterGridFilter;
    }
}