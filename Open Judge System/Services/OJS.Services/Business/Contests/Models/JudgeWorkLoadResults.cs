using System;

namespace OJS.Services.Business.Contests.Models
{
    public class JudgeLoadResults
    {
        //Judge work
        public int Submissions { get; set; }

        public int TotalWork  => (int)Math.Ceiling((this.Submissions * 2) / 60.0);

        public int ProcessedSubmissionsPerWorkerPerMinute { get; set; }

        public int MinimumWorkersRequired { get; set; }

        //Minimum required workers multiplied by safety factor with value 1.2;
        public int SuggestedWorkers => (int)Math.Round(this.MinimumWorkersRequired * 1.2);

        //Doomsday scenario

        public int JudgeWork { get; set; }

        public int JudgeWorkInMinute { get; set; }

        public int SecondsBetweenSubmissionsBase { get; set; }

        public int SecondsBetweenSubmissionsHigh { get; set; }

        //Distribution Results
        public int MaxSubmissionsPerMinute { get; set; }

        public int MaxDistributedWorkersRequired { get; set; }

        public int JudgeWorkRequiredInMinutes { get; set; }

        public int JudgeWorkRequiredPerWorkerInSeconds { get; set; }

        public int SecondsBetweenSubmission { get; set; }

        public int MaxSecondsBetweenSubmissions { get; set; }

        public double MaxUsersAtSameTime { get; set; }
    }
}
