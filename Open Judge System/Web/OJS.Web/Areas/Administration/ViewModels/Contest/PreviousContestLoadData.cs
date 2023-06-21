namespace OJS.Web.Areas.Administration.ViewModels.Contest
{
    using System.Linq;

    public class PreviousContestLoadData
    {
        public PreviousContestLoadData(OJS.Data.Models.Contest contest)
        {
            this.Id = contest.Id;
            this.Name = contest.Name;
            this.ProblemsCount = contest.ProblemGroups.SelectMany(x => x.Problems).Count();

            this.PreviousContestSubmissions = contest.ProblemGroups
               .SelectMany(pg => pg.Problems)
               .SelectMany(p => p.Submissions)
               .Count();

            this.PreviousContestStudents = contest.Participants
                .Where(x => x.IsOfficial == true)
                .Count();
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public int ProblemsCount { get; set; }

        public int PreviousContestSubmissions { get; set; }

        public int PreviousContestStudents { get; set; }

        public int OldAverageProblemRunTimeInSeconds { get; set; }
    }
}