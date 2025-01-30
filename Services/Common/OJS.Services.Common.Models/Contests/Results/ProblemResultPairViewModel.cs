namespace OJS.Services.Common.Models.Contests.Results;

using OJS.Common.Enumerations;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Models.Submissions;
using System;
using System.Linq.Expressions;

public class ProblemResultPairViewModel
{
    public static Expression<Func<ParticipantScore, ProblemResultPairViewModel>> FromParticipantScoreAsSimpleResult =>
        score => new ProblemResultPairViewModel
        {
            ParticipantId = score.ParticipantId,
            ProblemId = score.ProblemId,
            BestSubmission = new BestSubmissionViewModel { Id = score.SubmissionId, Points = score.Points },
        };

    public static Expression<Func<ParticipantScore, ProblemResultPairViewModel>> FromParticipantScoreAsFullResult =>
        score => new ProblemResultPairViewModel
        {
            ParticipantId = score.ParticipantId,
            ProblemId = score.ProblemId,
            MaximumPoints = score.Problem.MaximumPoints,
            BestSubmission = new BestSubmissionViewModel
            {
                Id = score.SubmissionId,
                Points = score.Points,
                IsCompiledSuccessfully = score.Submission != null &&
                                         score.Submission.IsCompiledSuccessfully,
                SubmissionType = score.Submission != null
                    ? score.Submission.SubmissionType!.Name
                    : null,
                TestRunsCache = score.Submission != null
                    ? score.Submission.TestRunsCache
                    : null,
            },
        };

    public static Expression<Func<ParticipantScore, ProblemResultPairViewModel>> FromParticipantScoreAsExportResult =>
        score => new ProblemResultPairViewModel
        {
            ParticipantId = score.ParticipantId,
            ProblemId = score.ProblemId,
            IsExcludedFromHomework = score.Problem.ProblemGroup.Type == ProblemGroupType.ExcludedFromHomework,
            BestSubmission = new BestSubmissionViewModel { Id = score.SubmissionId, Points = score.Points },
        };

    public int ParticipantId { get; set; }

    public int ProblemId { get; set; }

    public bool IsExcludedFromHomework { get; set; }

    public int MaximumPoints { get; set; }

    public BestSubmissionViewModel BestSubmission { get; set; } = new();
}