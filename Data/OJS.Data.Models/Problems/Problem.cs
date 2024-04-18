namespace OJS.Data.Models.Problems
{
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using OJS.Data.Models.Checkers;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Submissions;
    using OJS.Data.Models.Tests;
    using OJS.Data.Infrastructure.Models;
    using static OJS.Data.Validation.ConstraintConstants.Problem;

    public class Problem : DeletableAuditInfoEntity<int>, IOrderableEntity
    {
        public int ProblemGroupId { get; set; }

        public virtual ProblemGroup ProblemGroup { get; set; } = null!;

        [Required]
        [MaxLength(NameMaxLength)]
        public string Name { get; set; } = string.Empty;

        public short MaximumPoints { get; set; }

        /// <summary>
        /// Gets or sets a Time limit for the problem. Measured in milliseconds.
        /// </summary>
        public int TimeLimit { get; set; }

        /// <summary>
        /// Gets or sets a Memory limit for the problem. Measured in bytes.
        /// </summary>
        public int MemoryLimit { get; set; }

        /// <summary>
        /// Gets or sets a File size limit (measured in bytes).
        /// </summary>
        public int? SourceCodeSizeLimit { get; set; }

        public int? CheckerId { get; set; }

        public virtual Checker? Checker { get; set; }

        public double OrderBy { get; set; }

        /// <summary>
        /// Gets or sets a predefined skeleton for the task.
        /// </summary>
        public byte[]? SolutionSkeleton { get; set; }

        /// <summary>
        /// Gets or sets Problem specific dependencies that will be compiled and executed with the user code
        /// such as Solution skeletons, mocks or data and text files.
        /// </summary>
        // Deprecated
        public byte[]? AdditionalFiles { get; set; }

        [DefaultValue(true)]
        public bool ShowResults { get; set; }

        [DefaultValue(false)]
        public bool ShowDetailedFeedback { get; set; }

        public virtual ICollection<Test> Tests { get; set; } = new HashSet<Test>();

        public virtual ICollection<ProblemResource> Resources { get; set; } = new HashSet<ProblemResource>();

        public virtual ICollection<Submission> Submissions { get; set; } = new HashSet<Submission>();

        public virtual ICollection<TagInProblem> TagsInProblems { get; set; } = new HashSet<TagInProblem>();

        public virtual ICollection<ParticipantScore> ParticipantScores { get; set; } = new HashSet<ParticipantScore>();

        public virtual ICollection<SubmissionTypeInProblem> SubmissionTypesInProblems { get; set; } =
            new HashSet<SubmissionTypeInProblem>();

        public virtual ICollection<ProblemForParticipant> ProblemsForParticipants { get; set; } =
            new HashSet<ProblemForParticipant>();

        public override string ToString() => $"#{this.Id} {this.Name}";
    }
}