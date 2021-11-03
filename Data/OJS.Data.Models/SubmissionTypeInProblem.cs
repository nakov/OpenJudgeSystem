namespace OJS.Data.Models
{
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;
    using System.ComponentModel.DataAnnotations.Schema;

    public class SubmissionTypeInProblem
    {
        [Column("SubmissionType_Id")]
        public int SubmissionTypeId { get; set; }

        public SubmissionType SubmissionType { get; set; }

        [Column("Problem_Id")]
        public int ProblemId { get; set; }

        public Problem Problem { get; set; }
    }
}