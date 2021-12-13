namespace OJS.Servers.Administration.Controllers
{
    using Ionic.Zip;
    using Microsoft.AspNetCore.Mvc;
    using OJS.Common;
    using OJS.Common.Extensions.Strings;
    using OJS.Data.Models.Submissions;
    using OJS.Servers.Administration.Models.Contests;
    using OJS.Servers.Administration.Models.Participants;
    using OJS.Servers.Administration.Models.Problems;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Administration.Data;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using ZipFile = Ionic.Zip.ZipFile;

    public class ContestsExportController : BaseAdminViewController
    {
        private readonly IContestsDataService contestsData;
        private readonly IParticipantsDataService participantsData;
        private readonly ISubmissionsDataService submissionsData;
        private readonly IProblemsDataService problemsData;

        public ContestsExportController(
            IContestsDataService contestsData,
            IParticipantsDataService participantsData,
            ISubmissionsDataService submissionsData,
            IProblemsDataService problemsData)
        {
            this.contestsData = contestsData;
            this.participantsData = participantsData;
            this.submissionsData = submissionsData;
            this.problemsData = problemsData;
        }

        public async Task<IActionResult> Solutions(int id, bool compete, SubmissionExportType exportType)
        {
            var userHasAccessToContest = this.User.IsAdmin() ||
                await this.contestsData.IsUserLecturerInByContestAndUser(id, this.User.GetId());

            if (!userHasAccessToContest)
            {
                return this.RedirectToContestsAdminPanelWithNoPrivilegesMessage();
            }

            var contestName = await this.contestsData.GetNameById(id);
            if (string.IsNullOrWhiteSpace(contestName))
            {
                this.TempData[GlobalConstants.DangerMessage] = "No such contest";
                return this.RedirectToAction("Index", "Home", new { area = string.Empty });
            }

            var problems = this.GetContestProblems(id);

            var participants = this.GetContestParticipants(id, compete);

            var fileComment = PrepareSolutionsFileComment(compete, contestName, participants.Count, problems);

            var file = PrepareSolutionsZipFile(fileComment);

            Func<int, int, Submission> getSubmissionFunc = exportType switch
            {
                SubmissionExportType.BestSubmissions => this.GetBestSubmission,
                SubmissionExportType.LastSubmissions => this.GetLastSubmission,
                _ => null
            };

            this.ZipParticipantsSolutions(participants, file, problems, getSubmissionFunc);

            var zipFileName = string.Format(
                "{1} {2} submissions for {0}.zip",
                contestName,
                compete ? "Contest" : "Practice",
                exportType switch
                {
                    SubmissionExportType.BestSubmissions => "best",
                    SubmissionExportType.LastSubmissions => "last",
                    _ => "all"
                });

            // TODO: Test this approach for returning the zip file
            var stream = new MemoryStream();
            file.Save(stream);
            return this.File(stream, zipFileName);
        }

        private static StringBuilder PrepareSolutionsFileComment(
            bool isOfficialContest,
            string contestName,
            int participantsCount,
            IEnumerable<ProblemModel> problems)
        {
            var fileComment = new StringBuilder();

            fileComment.AppendLine(string.Format("{1} submissions for {0}", contestName, isOfficialContest ? "Contest" : "Practice"));
            fileComment.AppendLine($"Number of participants: {participantsCount}");
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

            return fileComment;
        }

        private static void ZipSubmission(
            ZipFile file,
            ProblemModel problem,
            Submission submission,
            string directoryName,
            bool includeDateInFileName = false)
        {
            var fileNameWithoutExtension =
                includeDateInFileName ? $"{problem.Name}-{submission.CreatedOn:dd-MM-yyyy HH:mm:ss:fff}" : problem.Name;

            var fileName =
                $"{fileNameWithoutExtension}.{submission.FileExtension ?? submission.SubmissionType.FileNameExtension}-{submission.Id}"
                    .ToValidFileName();

            var content = submission.IsBinaryFile ? submission.Content : submission.ContentAsString.ToByteArray();

            var entry = file.AddEntry($"{directoryName}\\{fileName}", content);
            entry.CreationTime = submission.CreatedOn;
            entry.ModifiedTime = submission.CreatedOn;
        }

        private static ZipFile PrepareSolutionsZipFile(StringBuilder fileComment)
        {
            var file = new ZipFile
            {
                Comment = fileComment.ToString(),
                AlternateEncoding = Encoding.UTF8,
                AlternateEncodingUsage = ZipOption.AsNecessary,
                UseZip64WhenSaving = Zip64Option.Always,
            };

            return file;
        }

        private void ZipParticipantsSolutions(
            IEnumerable<ParticipantModel> participants,
            ZipFile file,
            ICollection<ProblemModel> problems,
            Func<int, int, Submission> getSubmission)
        {
            foreach (var participant in participants)
            {
                // Create directory with the participants name
                var directoryName = $"{participant.UserName} ({participant.FirstName} {participant.LastName})"
                    .ToValidFilePath();
                file.AddDirectoryByName(directoryName);

                foreach (var problem in problems)
                {
                    // All submissions
                    if (getSubmission == null)
                    {
                        var submissions = this.GetAllSubmissions(participant.Id, problem.Id);

                        foreach (var submission in submissions)
                        {
                            ZipSubmission(file, problem, submission, directoryName, true);
                        }
                    }
                    else
                    {
                        var submission = getSubmission(participant.Id, problem.Id);

                        if (submission != null)
                        {
                            ZipSubmission(file, problem, submission, directoryName);
                        }
                    }
                }
            }
        }

        private IList<ParticipantModel> GetContestParticipants(int contestId, bool isOfficialContest)
        {
            var participants = this.participantsData
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

        private Submission GetBestSubmission(int participantId, int problemId) =>
            this.submissionsData
                .GetQuery()
                .Where(submission => submission.ParticipantId == participantId && submission.ProblemId == problemId)
                .OrderByDescending(submission => submission.Points)
                .ThenByDescending(submission => submission.CreatedOn)
                .FirstOrDefault();

        private Submission GetLastSubmission(int participantId, int problemId) =>
            this.submissionsData
                .GetQuery()
                .Where(submission => submission.ParticipantId == participantId && submission.ProblemId == problemId)
                .OrderByDescending(submission => submission.CreatedOn)
                .FirstOrDefault();

        private IEnumerable<Submission> GetAllSubmissions(int participantId, int problemId) =>
            this.submissionsData
                .GetQuery()
                .Where(submission => submission.ParticipantId == participantId && submission.ProblemId == problemId)
                .OrderByDescending(submission => submission.CreatedOn)
                .ToList();
    }
}