namespace OJS.Data.Models
{
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;

    public class SubmissionTypeInProblem
    {
        public int SubmissionTypeId { get; set; }

        public virtual SubmissionType SubmissionType { get; set; } = new();

        public int ProblemId { get; set; }

        public virtual Problem Problem { get; set; } = new();
    }
}