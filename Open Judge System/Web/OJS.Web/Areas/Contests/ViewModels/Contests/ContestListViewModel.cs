﻿namespace OJS.Web.Areas.Contests.ViewModels.Contests
{
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    using OJS.Common.Models;
    using OJS.Data.Models;

    public class ContestListViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int OfficialParticipants { get; set; }

        public int PracticeParticipants { get; set; }

        public int ProblemsCount { get; set; }

        public bool HasContestPassword { get; set; }

        public bool HasPracticePassword { get; set; }

        public bool CanBeCompeted { get; set; }

        public bool CanBePracticed { get; set; }

        public bool ResultsArePubliclyVisible { get; set; }

        public bool UserIsParticipant { get; set; }

        public bool UserIsAdminOrLecturerInContest { get; set; }

        public ContestType Type { get; set; }

        public DateTime? ImportedOn { get; set; }

        public string ImportedFromUrl { get; set; }

        public static Expression<Func<Contest, ContestListViewModel>> FromContest(string userId, bool isUserAdmin) =>
            contest => new ContestListViewModel
            {
                Id = contest.Id,
                Name = contest.Name,
                ProblemsCount = contest.ProblemGroups.Count(pg => !pg.IsDeleted),
                Type = contest.Type,
                HasContestPassword = contest.ContestPassword != null,
                HasPracticePassword = contest.PracticePassword != null,
                ImportedOn = contest.ImportedOn,
                ImportedFromUrl = contest.ImportedFromUrl,
                CanBeCompeted = contest.StartTime.HasValue &&
                        contest.StartTime.Value <= DateTime.Now &&
                        (!contest.EndTime.HasValue || contest.EndTime.Value >= DateTime.Now),
                CanBePracticed = contest.PracticeStartTime.HasValue &&
                     contest.PracticeStartTime.Value <= DateTime.Now &&
                     (!contest.PracticeEndTime.HasValue ||
                      contest.PracticeEndTime.Value >= DateTime.Now),
                ResultsArePubliclyVisible = contest.StartTime.HasValue &&
                    contest.EndTime.HasValue &&
                    contest.EndTime.Value < DateTime.Now,
                UserIsAdminOrLecturerInContest = isUserAdmin || contest.Lecturers.Any(l => l.LecturerId == userId),
            };
    }
}