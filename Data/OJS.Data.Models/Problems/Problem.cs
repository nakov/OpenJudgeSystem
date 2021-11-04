namespace OJS.Data.Models.Problems
{
    using OJS.Data.Infrastructure.Models;
    using OJS.Data.Models.Checkers;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Submissions;
    using OJS.Data.Models.Tests;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using static OJS.Data.Validation.ConstraintConstants.Problem;

    public class Problem : DeletableAuditInfoEntity<int>, IOrderableEntity
    {
        public int ProblemGroupId { get; set; }

        public ProblemGroup ProblemGroup { get; set; }

        [Required]
        [MaxLength(NameMaxLength)]
        public string Name { get; set; }

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

        public Checker Checker { get; set; }

        public double OrderBy { get; set; }

        /// <summary>
        /// Gets or sets a predefined skeleton for the task
        /// </summary>
        public byte[] SolutionSkeleton { get; set; }

        /// <summary>
        /// Gets or sets Problem specific dependencies that will be compiled and executed with the user code
        /// such as Solution skeletons, mocks or data and text files.
        /// </summary>
        public byte[] AdditionalFiles { get; set; }

        [DefaultValue(true)]
        public bool ShowResults { get; set; }

        [DefaultValue(false)]
        public bool ShowDetailedFeedback { get; set; }

        public ICollection<Test> Tests { get; set; } = new HashSet<Test>();

        public ICollection<ProblemResource> Resources { get; set; } = new HashSet<ProblemResource>();

        public ICollection<Submission> Submissions { get; set; } = new HashSet<Submission>();

        public ICollection<TagInProblem> TagsInProblems { get; set; } = new HashSet<TagInProblem>();

        public ICollection<ParticipantScore> ParticipantScores { get; set; } = new HashSet<ParticipantScore>();

        public ICollection<SubmissionTypeInProblem> SubmissionTypesInProblems { get; set; } =
            new HashSet<SubmissionTypeInProblem>();

        public ICollection<Participant> Participants { get; set; } = new HashSet<Participant>();
    }
}