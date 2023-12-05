namespace OJS.Data.Models
{
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;
    using SoftUni.Data.Infrastructure.Models;

    public class ProblemSubmissionTypeExecutionDetails : IEntity
    {
        public int SubmissionTypeId { get; set; }

        public virtual SubmissionType SubmissionType { get; set; } = null!;

        public int ProblemId { get; set; }

        public virtual Problem Problem { get; set; } = null!;

        /// <summary>
        /// Gets or sets a predefined skeleton for the task and strategy.
        /// </summary>
        public byte[]? SolutionSkeleton { get; set; }

        /// <summary>
        /// Gets or sets a time limit for the task and strategy.
        /// </summary>
        public int? TimeLimit { get; set; }

        /// <summary>
        /// Gets or sets a memory limit for the task and strategy.
        /// </summary>
        public int? MemoryLimit { get; set; }
    }
}