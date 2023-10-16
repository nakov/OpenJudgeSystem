namespace OJS.Services.Common.Models.Contests.Results;

using OJS.Common.Enumerations;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Models.Submissions;
using System;
using System.Linq.Expressions;

public class ProblemResultPairServiceModel
{
    public static Expression<Func<ParticipantScore, ProblemResultPairServiceModel>> FromParticipantScoreAsSimpleResult =>
        score => new ProblemResultPairServiceModel
        {
            ProblemId = score.ProblemId,
            ShowResult = score.Problem.ShowResults,
            BestSubmission = new BestSubmissionServiceModel { Id = score.SubmissionId, Points = score.Points },
        };

    public static Expression<Func<ParticipantScore, ProblemResultPairServiceModel>> FromParticipantScoreAsFullResult =>
        score => new ProblemResultPairServiceModel
        {
            ProblemId = score.ProblemId,
            ShowResult = score.Problem.ShowResults,
            MaximumPoints = score.Problem.MaximumPoints,
            BestSubmission = new BestSubmissionServiceModel
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

    public static Expression<Func<ParticipantScore, ProblemResultPairServiceModel>> FromParticipantScoreAsExportResult =>
        score => new ProblemResultPairServiceModel
        {
            ProblemId = score.ProblemId,
            ShowResult = score.Problem.ShowResults,
            IsExcludedFromHomework = score.Problem.ProblemGroup.Type == ProblemGroupType.ExcludedFromHomework,
            BestSubmission = new BestSubmissionServiceModel { Id = score.SubmissionId, Points = score.Points },
        };

    public int ProblemId { get; set; }

    public bool ShowResult { get; set; }

    public bool IsExcludedFromHomework { get; set; }

    public int MaximumPoints { get; set; }

    public BestSubmissionServiceModel BestSubmission { get; set; } = new ();
}