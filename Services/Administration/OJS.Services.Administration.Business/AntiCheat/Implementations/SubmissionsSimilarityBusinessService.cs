namespace OJS.Services.Administration.Business.AntiCheat.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business.Validation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.AntiCheat;
using OJS.Services.Common;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.Common.Extensions.Export;
using SoftUni.Judge.Common;
using SoftUni.Judge.Common.Enumerations;
using SoftUni.Judge.Workers.Tools.AntiCheat;
using SoftUni.Judge.Workers.Tools.AntiCheat.Contracts;
using SoftUni.Judge.Workers.Tools.Similarity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static OJS.Common.GlobalConstants.FileExtensions;
using static OJS.Common.GlobalConstants.Urls;

public class SubmissionsSimilarityBusinessService : ISubmissionsSimilarityBusinessService
{
    private const int MinSubmissionPointsToCheckForSimilarity = 20;

    private readonly ISubmissionsDataService submissionsData;
    private readonly ISimilarityFinder similarityFinder;
    private readonly IPlagiarismDetectorFactory plagiarismDetectorFactory;
    private readonly IContestsDataService contestsData;
    private readonly ISubmissionSimilaritiesValidationService submissionSimilaritiesValidation;
    private readonly IApplicationUrlsService applicationUrls;

    public SubmissionsSimilarityBusinessService(
        ISubmissionsDataService submissionsData,
        ISimilarityFinder similarityFinder,
        IPlagiarismDetectorFactory plagiarismDetectorFactory,
        IContestsDataService contestsData,
        ISubmissionSimilaritiesValidationService submissionSimilaritiesValidation,
        IApplicationUrlsService applicationUrls)
    {
        this.submissionsData = submissionsData;
        this.similarityFinder = similarityFinder;
        this.plagiarismDetectorFactory = plagiarismDetectorFactory;
        this.contestsData = contestsData;
        this.submissionSimilaritiesValidation = submissionSimilaritiesValidation;
        this.applicationUrls = applicationUrls;
    }

    public async Task<(byte[] file, string fileName)> GetSimilaritiesForFiltersAsExcel(
        SubmissionSimilarityFiltersServiceModel filters)
    {
        var contestId = filters.ContestId;
        var plagiarismDetectorType = filters.PlagiarismDetectorType;

        var contest = await this.contestsData.OneById(contestId);

        this.submissionSimilaritiesValidation
            .GetValidationResult(contest)
            .VerifyResult();

        var participantsSimilarSubmissionGroups =
            (await this.GetSimilarSubmissions(new [] { contestId }, plagiarismDetectorType)
                .Select(s => new
                {
                    s.Id,
                    s.ProblemId,
                    s.ParticipantId,
                    s.Points,
                    s.Content,
                    s.CreatedOn,
                    ParticipantName = s.Participant.User.UserName,
                    ProblemName = s.Problem.Name,
                    TestRuns = s.TestRuns.OrderBy(t => t.TestId).Select(t => new { t.TestId, t.ResultType })
                })
                .ToListAsync())
                .GroupBy(s => new { s.ProblemId, s.ParticipantId })
                .Select(g => g.OrderByDescending(s => s.Points).ThenByDescending(s => s.CreatedOn).FirstOrDefault())
                .GroupBy(s => new { s.ProblemId, s.Points })
                .ToList();

        var plagiarismDetector = this.GetPlagiarismDetector(plagiarismDetectorType);

        var similarities = new List<SubmissionSimilarityServiceModel>();
        var uiUrl = this.applicationUrls.GetUrl(ApplicationName.Ui);
        for (var index = 0; index < participantsSimilarSubmissionGroups.Count; index++)
        {
            var groupOfSubmissions = participantsSimilarSubmissionGroups[index].ToList();
            for (var i = 0; i < groupOfSubmissions.Count; i++)
            {
                for (var j = i + 1; j < groupOfSubmissions.Count; j++)
                {
                    var result = plagiarismDetector.DetectPlagiarism(
                        groupOfSubmissions[i].Content.Decompress(),
                        groupOfSubmissions[j].Content.Decompress(),
                        new List<IDetectPlagiarismVisitor> { new SortAndTrimLinesVisitor() });

                    var save = true;

                    var firstTestRuns = groupOfSubmissions[i].TestRuns.ToList();
                    var secondTestRuns = groupOfSubmissions[j].TestRuns.ToList();

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
                        var firstSubmissionId = groupOfSubmissions[i].Id;
                        var secondSubmissionId = groupOfSubmissions[j].Id;

                        similarities.Add(new SubmissionSimilarityServiceModel
                        {
                            ProblemName = groupOfSubmissions[i].ProblemName,
                            Points = groupOfSubmissions[i].Points,
                            Differences = result.Differences.Count,
                            Percentage = result.SimilarityPercentage,
                            FirstSubmissionId = firstSubmissionId,
                            FirstSubmissionLink = uiUrl + string.Format(SubmissionDetailsPathTemplate, firstSubmissionId),
                            FirstParticipantName = groupOfSubmissions[i].ParticipantName,
                            FirstSubmissionCreatedOn = groupOfSubmissions[i].CreatedOn,
                            SecondSubmissionId = secondSubmissionId,
                            SecondSubmissionLink = uiUrl + string.Format(SubmissionDetailsPathTemplate, secondSubmissionId),
                            SecondParticipantName = groupOfSubmissions[j].ParticipantName,
                            SecondSubmissionCreatedOn = groupOfSubmissions[j].CreatedOn,
                        });
                    }
                }
            }
        }

        // TODO: convert result to file
        var file = similarities.ToExcel();
        var fileName = $"{contest!.Name}_similarities{Excel}";

        return (file, fileName);
    }

    private IQueryable<Submission> GetSimilarSubmissions(
        IEnumerable<int> contestIds,
        PlagiarismDetectorType plagiarismDetectorType)
    {
        var orExpressionContestIds = ExpressionBuilder.BuildOrExpression<Submission, int>(
            contestIds,
            s => s.Participant.ContestId);

        var plagiarismDetectorTypeCompatibleCompilerTypes = plagiarismDetectorType.GetCompatibleCompilerTypes();
        var orExpressionCompilerTypes = ExpressionBuilder.BuildOrExpression<Submission, CompilerType>(
            plagiarismDetectorTypeCompatibleCompilerTypes,
            s => s.SubmissionType.CompilerType);

        var result = this.submissionsData
            .GetQuery()
            .Where(orExpressionContestIds)
            .Where(orExpressionCompilerTypes)
            .Where(s => s.Participant.IsOfficial && s.Points >= MinSubmissionPointsToCheckForSimilarity);

        return result;
    }

    private IPlagiarismDetector GetPlagiarismDetector(PlagiarismDetectorType type)
    {
        var plagiarismDetectorCreationContext =
            this.CreatePlagiarismDetectorCreationContext(type);
        var plagiarismDetector =
            this.plagiarismDetectorFactory.CreatePlagiarismDetector(plagiarismDetectorCreationContext);

        return plagiarismDetector;
    }

    private PlagiarismDetectorCreationContext CreatePlagiarismDetectorCreationContext(PlagiarismDetectorType type)
    {
        var result = new PlagiarismDetectorCreationContext(type, this.similarityFinder);

        switch (type)
        {
            case PlagiarismDetectorType.CSharpCompileDisassemble:
                result.CompilerPath = Settings.CSharpCompilerPath;
                result.DisassemblerPath = Settings.DotNetDisassemblerPath;
                break;

            case PlagiarismDetectorType.CSharpDotNetCoreCompileDisassemble:
                result.CompilerPath = Settings.DotNetCompilerPath;
                result.DisassemblerPath = Settings.DotNetDisassemblerPath;
                break;

            case PlagiarismDetectorType.JavaCompileDisassemble:
                result.CompilerPath = Settings.JavaCompilerPath;
                result.DisassemblerPath = Settings.JavaDisassemblerPath;
                break;

            case PlagiarismDetectorType.PlainText:
                break;
        }

        return result;
    }
}