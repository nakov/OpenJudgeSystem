namespace OJS.Servers.Administration.Controllers;

using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Extensions.Strings;
using OJS.Data.Models.Submissions;
using OJS.Servers.Administration.Extensions;
using OJS.Servers.Administration.Models.Contests;
using OJS.Servers.Administration.Models.Participants;
using OJS.Servers.Administration.Models.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Common;
using OJS.Services.Common.Data;
using OJS.Services.Common.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static OJS.Common.GlobalConstants.MimeTypes;
using ISubmissionsDataService = OJS.Services.Administration.Data.ISubmissionsDataService;

public class ContestsExportController : BaseAdminViewController
{
    private readonly IContestsDataService contestsData;
    private readonly IParticipantsCommonDataService participantsCommonData;
    private readonly ISubmissionsDataService submissionsData;
    private readonly IProblemsDataService problemsData;
    private readonly IZipArchivesService zipArchives;

    public ContestsExportController(
        IContestsDataService contestsData,
        IParticipantsCommonDataService participantsCommonData,
        ISubmissionsDataService submissionsData,
        IProblemsDataService problemsData,
        IZipArchivesService zipArchives)
    {
        this.contestsData = contestsData;
        this.participantsCommonData = participantsCommonData;
        this.submissionsData = submissionsData;
        this.problemsData = problemsData;
        this.zipArchives = zipArchives;
    }

    [HttpPost]
    public async Task<IActionResult> Solutions(DownloadSubmissionsModel model)
    {
        var id = model.ContestId;
        var compete = model.ContestExportResultType == ContestExportResultType.Compete;
        var exportType = model.SubmissionExportType;

        var userHasAccessToContest = this.User.IsAdmin() ||
            await this.contestsData.IsUserLecturerInContestByContestAndUser(id, this.User.GetId());

        if (!userHasAccessToContest)
        {
            return this.RedirectToContestsAdminPanelWithNoPrivilegesMessage();
        }

        var contestName = await this.contestsData.GetNameById(id);
        if (string.IsNullOrWhiteSpace(contestName))
        {
            this.TempData.AddDangerMessage("No such contest");
            return this.RedirectToAction("Index", "Contests");
        }

        var problems = this.GetContestProblems(id);

        var participants = this.GetContestParticipants(id, compete);

        Func<int, int, Submission?>? getSubmissionFunc = exportType switch
        {
            SubmissionExportType.BestSubmissions => this.GetBestSubmission,
            SubmissionExportType.LastSubmissions => this.GetLastSubmission,
            _ => null,
        };

        var files = this.ZipParticipantsSolutions(participants, problems, getSubmissionFunc).ToList();
        var fileComment = PrepareSolutionsFileComment(compete, contestName, participants, problems);

        files.Add(new InMemoryFile
        {
            FileName = "Comment.txt",
            Content = Encoding.UTF8.GetBytes(fileComment.ToString()),
        });

        var zipFile = await this.zipArchives.GetZipArchive(files);

        var zipFileName = string.Format(
            "{1} {2} submissions for {0}.zip",
            contestName,
            compete ? "Contest" : "Practice",
            exportType == SubmissionExportType.BestSubmissions ? "best" : exportType == SubmissionExportType.LastSubmissions ? "last" : "all");

        return this.File(zipFile, ApplicationZip, zipFileName);
    }

    private static string GetParticipantName(ParticipantModel participant)
        => $"{participant.UserName} ({participant.FirstName} {participant.LastName})";

    private static StringBuilder PrepareSolutionsFileComment(
        bool isOfficialContest,
        string contestName,
        ICollection<ParticipantModel> participants,
        IEnumerable<ProblemModel> problems)
    {
        var fileComment = new StringBuilder();

        fileComment.AppendLine(string.Format("{1} submissions for {0}", contestName, isOfficialContest ? "Contest" : "Practice"));
        fileComment.AppendLine($"Number of participants: {participants.Count}");
        fileComment.AppendLine();

        fileComment.AppendLine("Problems:");
        foreach (var problem in problems)
        {
            fileComment.AppendLine(string.Format(
                "{0} - {1} points, time limit: {2:0.000} sec., memory limit: {3:0.00} MB",
                problem.Name,
                problem.MaximumPoints,
                problem.TimeLimit / 1000.0,
                problem.MemoryLimit / 1024.0 / 1024.0));
        }

        fileComment.AppendLine();
        fileComment.AppendLine("Participants:");
        participants.ForEach(p => fileComment.AppendLine(GetParticipantName(p)));

        return fileComment;
    }

    private static InMemoryFile ZipSubmission(
        ProblemModel problem,
        Submission submission,
        string directoryName,
        bool includeDateInFileName = false)
    {
        var fileNameWithoutExtension =
            includeDateInFileName ? $"{problem.Name}-{submission.CreatedOn:dd-MM-yyyy HH:mm:ss:fff}" : problem.Name;

        var fileName =
            $"{fileNameWithoutExtension}.{submission.FileExtension ?? submission.SubmissionType!.FileNameExtension}-{submission.Id}"
                .ToValidFileName();

        var content = submission.IsBinaryFile ? submission.Content : submission.ContentAsString.ToByteArray();

        return new InMemoryFile
        {
            FileName = Path.Combine(directoryName, fileName),
            Content = content,
        };
    }

    private IEnumerable<InMemoryFile> ZipParticipantsSolutions(
        IEnumerable<ParticipantModel> participants,
        ICollection<ProblemModel> problems,
        Func<int, int, Submission?>? getSubmission)
    {
        var files = new List<InMemoryFile>();

        foreach (var participant in participants)
        {
            // Create directory with the participants name
            var directoryName = GetParticipantName(participant).ToValidFilePath();
            files.Add(new InMemoryFile
            {
                FileName = directoryName + "/",
            });

            foreach (var problem in problems)
            {
                // All submissions
                if (getSubmission == null)
                {
                    var submissions = this.GetAllSubmissions(participant.Id, problem.Id);

                    files.AddRange(
                        submissions
                            .Select(submission => ZipSubmission(problem, submission, directoryName, true)));
                }
                else
                {
                    var submission = getSubmission(participant.Id, problem.Id);

                    if (submission != null)
                    {
                        files.Add(ZipSubmission(problem, submission, directoryName));
                    }
                }
            }
        }

        return files;
    }

    private IList<ParticipantModel> GetContestParticipants(int contestId, bool isOfficialContest)
    {
        var participants = this.participantsCommonData
            .GetAllByContestAndIsOfficial(contestId, isOfficialContest)
            .Select(ParticipantModel.Model)
            .OrderBy(x => x.UserName)
            .ToList();

        return participants;
    }

    private IList<ProblemModel> GetContestProblems(int contestId)
    {
        var problems = this.problemsData
            .GetQuery()
            .Where(p => p.ProblemGroup.ContestId == contestId)
            .OrderBy(x => x.OrderBy)
            .ThenBy(x => x.Name)
            .Select(ProblemModel.Model)
            .ToList();

        return problems;
    }

    private Submission? GetBestSubmission(int participantId, int problemId) =>
        this.submissionsData
            .GetQuery()
            .Where(submission => submission.ParticipantId == participantId && submission.ProblemId == problemId)
            .OrderByDescending(submission => submission.Points)
            .ThenByDescending(submission => submission.CreatedOn)
            .Include(s => s.SubmissionType)
            .FirstOrDefault();

    private Submission? GetLastSubmission(int participantId, int problemId) =>
        this.submissionsData
            .GetQuery()
            .Where(submission => submission.ParticipantId == participantId && submission.ProblemId == problemId)
            .OrderByDescending(submission => submission.CreatedOn)
            .Include(s => s.SubmissionType)
            .FirstOrDefault();

    private IEnumerable<Submission> GetAllSubmissions(int participantId, int problemId) =>
        this.submissionsData
            .GetQuery()
            .Where(submission => submission.ParticipantId == participantId && submission.ProblemId == problemId)
            .OrderByDescending(submission => submission.CreatedOn)
            .Include(s => s.SubmissionType)
            .ToList();
}