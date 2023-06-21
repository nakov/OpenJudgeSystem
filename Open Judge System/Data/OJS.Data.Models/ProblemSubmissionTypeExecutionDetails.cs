namespace OJS.Data.Models
{
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("ProblemSubmissionTypeExecutionDetails")]
    public class ProblemSubmissionTypeExecutionDetails
    {
        public int ProblemId { get; set; }

        public virtual Problem Problem { get; set; }
        
        public int SubmissionTypeId { get; set; }

        public virtual SubmissionType SubmissionType { get; set; }

        /// <summary>
        /// Gets or sets a predefined skeleton for the task and strategy
        /// </summary>
        public byte[] SolutionSkeleton { get; set; }

        /// <summary>
        /// Gets or sets a time limit for the task and strategy
        /// </summary>
        public int? TimeLimit { get; set; }
    }
}