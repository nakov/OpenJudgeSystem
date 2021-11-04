namespace OJS.Data.Models
{
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;

    public class SubmissionTypeInProblem
    {
        public int SubmissionTypeId { get; set; }

        public SubmissionType SubmissionType { get; set; }

        public int ProblemId { get; set; }

        public Problem Problem { get; set; }
    }
}