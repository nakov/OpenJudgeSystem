namespace OJS.Services.Administration.Business.Similarity;

using FluentExtensions.Extensions;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business.Similarity.SimilarityDetector;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Similarity;
using OJS.Workers.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

public class SimilarityService : ISimilarityService
{
    private readonly ISubmissionsDataService submissionsDataService;
    private readonly IContestsDataService contestsDataService;
    private readonly ISimilarityDetectorFactory similarityDetectorFactory;
    private readonly ISimilarityFinder similarityFinder;
    private readonly int minSubmissionPointsToCheckForSimilarity = 20;

    public SimilarityService(
        ISubmissionsDataService submissionsDataService,
        IContestsDataService contestsDataService,
        ISimilarityDetectorFactory similarityDetectorFactory,
        ISimilarityFinder similarityFinder)
    {
        this.submissionsDataService = submissionsDataService;
        this.contestsDataService = contestsDataService;
        this.similarityDetectorFactory = similarityDetectorFactory;
        this.similarityFinder = similarityFinder;
    }

    public async Task<Dictionary<string, IEnumerable<SubmissionSimilarityViewModel?>>> GetSubmissionSimilarities(SimillarityCheckModel model)
    {
        // The 'ContestIds' always contains a single contest id, belonging to the contest for which the similarity check is being done.
        var problemNames = await this.contestsDataService.GetProblemNamesById(model.ContestIds![0]);

        var similarities = new Dictionary<string, IEnumerable<SubmissionSimilarityViewModel?>>();

        foreach (var problemName in problemNames)
        {
            similarities.Add(problemName, new List<SubmissionSimilarityViewModel>());
        }

        var participantsSimilarSubmissionGroups =
            this.GetSimilarSubmissions(model)
                .Select(s => new
                {
                    s.Id,
                    s.ProblemId,
                    s.ParticipantId,
                    s.Points,
                    s.Content,
                    s.CreatedOn,
                    ParticipantName = s.Participant!.User.UserName,
                    ProblemName = s.Problem.Name,
                    TestRuns = s.TestRuns.OrderBy(t => t.TestId).Select(t => new { t.TestId, t.ResultType }),
                }).ToList();

        var filter = participantsSimilarSubmissionGroups.GroupBy(s => new { s.ProblemId, s.ParticipantId })
                    .Select(g => g.OrderByDescending(s => s.Points).ThenByDescending(s => s.CreatedOn).FirstOrDefault())
                    .GroupBy(s => new { s!.ProblemId, s.Points })
                    .ToList();

        var plagiarismDetector = this.GetPlagiarismDetector(model.SimilarityCheckType);

        for (var index = 0; index < filter.Count; index++)
        {
            var groupOfSubmissions = filter[index].ToList();
            for (var i = 0; i < groupOfSubmissions.Count; i++)
            {
                for (var j = i + 1; j < groupOfSubmissions.Count; j++)
                {
                    var result = plagiarismDetector.DetectPlagiarism(
                        groupOfSubmissions[i]!.Content.Decompress(),
                        groupOfSubmissions[j]!.Content.Decompress(),
                        new List<IDetectSimilarityVisitor> { new SortAndTrimLinesVisitor() });

                    var save = true;

                    var firstTestRuns = groupOfSubmissions[i]!.TestRuns.ToList();
                    var secondTestRuns = groupOfSubmissions[j]!.TestRuns.ToList();

                    if (firstTestRuns.Count < secondTestRuns.Count)
                    {
                        secondTestRuns = secondTestRuns
                            .Where(x => firstTestRuns.Any(y => y.TestId == x.TestId))
                            .OrderBy(x => x.TestId)
                            .ToList();
                    }
                    else if (firstTestRuns.Count > secondTestRuns.Count)
                    {
                        firstTestRuns = firstTestRuns
                            .Where(x => secondTestRuns.Any(y => y.TestId == x.TestId))
                            .OrderBy(x => x.TestId)
                            .ToList();
                    }

                    for (var k = 0; k < firstTestRuns.Count; k++)
                    {
                        if (firstTestRuns[k].ResultType != secondTestRuns[k].ResultType)
                        {
                            save = false;
                            break;
                        }
                    }

                    if (save && result.SimilarityPercentage != 0)
                    {
                        similarities[groupOfSubmissions[i]!.ProblemName] = similarities[groupOfSubmissions[i]!.ProblemName].Append(new SubmissionSimilarityViewModel
                        {
                            ProblemName = groupOfSubmissions[i]!.ProblemName,
                            Points = groupOfSubmissions[i]!.Points,
                            Differences = result.Differences!.Count,
                            Percentage = result.SimilarityPercentage,
                            FirstSubmissionId = groupOfSubmissions[i]!.Id,
                            FirstParticipantName = groupOfSubmissions[i]!.ParticipantName,
                            FirstSubmissionCreatedOn = groupOfSubmissions[i]!.CreatedOn,
                            SecondSubmissionId = groupOfSubmissions[j]!.Id,
                            SecondParticipantName = groupOfSubmissions[j]!.ParticipantName,
                            SecondSubmissionCreatedOn = groupOfSubmissions[j]!.CreatedOn,
                        });
                    }
                }
            }
        }

        return similarities;
    }

    private IQueryable<Submission> GetSimilarSubmissions(SimillarityCheckModel model)
    {
        var orExpressionContestIds = ExpressionBuilder.BuildOrExpression<Submission, int>(
                model.ContestIds!,
                s => s.Participant!.ContestId);

        var plagiarismDetectorTypeCompatibleCompilerTypes = model.SimilarityCheckType.GetCompatibleCompilerTypes();
        var orExpressionCompilerTypes = ExpressionBuilder.BuildOrExpression<Submission, CompilerType>(
                plagiarismDetectorTypeCompatibleCompilerTypes,
                s => s.SubmissionType!.CompilerType);

        var result = this.submissionsDataService.GetQuery()
            .Where(orExpressionContestIds)
                .Where(orExpressionCompilerTypes)
                .Where(s => s.Participant!.IsOfficial && s.Points >= this.minSubmissionPointsToCheckForSimilarity);

        return result;
    }

    private ISimilarityDetector GetPlagiarismDetector(SimilarityCheckType type)
    {
        var plagiarismDetectorCreationContext =
            this.CreatePlagiarismDetectorCreationContext(type);
        var plagiarismDetector =
            this.similarityDetectorFactory.CreatePlagiarismDetector(plagiarismDetectorCreationContext);

        return plagiarismDetector;
    }

    private SimilarityDetectorCreationContext CreatePlagiarismDetectorCreationContext(SimilarityCheckType type)
    {
        var result = new SimilarityDetectorCreationContext(type, this.similarityFinder);

        switch (type)
        {
            case SimilarityCheckType.Text:
                break;
        }

        return result;
    }
}