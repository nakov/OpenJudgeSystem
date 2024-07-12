namespace OJS.Data.Models.Submissions
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using OJS.Workers.Common.Models;
    using OJS.Data.Models.Common;
    using OJS.Workers.Common.Extensions;
    using static OJS.Data.Validation.ConstraintConstants.SubmissionTypes;

    public class SubmissionType : Entity<int>
    {
        [Required]
        [MaxLength(NameMaxLength)]
        [MinLength(NameMinLength)]
        public string Name { get; set; } = string.Empty;

        [DefaultValue(false)]
        public bool IsSelectedByDefault { get; set; }

        public ExecutionStrategyType ExecutionStrategyType { get; set; }

        public CompilerType CompilerType { get; set; }

        public string? AdditionalCompilerArguments { get; set; }

        public string? Description { get; set; }

        [DefaultValue(false)]
        public bool AllowBinaryFilesUpload { get; set; }

        /// <summary>
        /// Gets or sets a comma-separated list of allowed file extensions.
        /// If the value is null or whitespace then only text values are allowed.
        /// If any extension is specified then no text input is allowed.
        /// </summary>
        public string? AllowedFileExtensions { get; set; }

        public int? BaseTimeUsedInMilliseconds { get; set; }

        public int? BaseMemoryUsedInBytes { get; set; }

        public int? MaxAllowedTimeLimitInMilliseconds { get; set; }

        public int? MaxAllowedMemoryLimitInBytes { get; set; }

        [NotMapped]
        public IEnumerable<string> AllowedFileExtensionsList
        {
            get
            {
                var list =
                    this.AllowedFileExtensions?.Split(new[] { ',', ';', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(x => x.Trim());
                return list?.ToArray() ?? Enumerable.Empty<string>();
            }
        }

        public virtual ICollection<SubmissionTypeInProblem> SubmissionTypesInProblems { get; set; } =
            new HashSet<SubmissionTypeInProblem>();

        [NotMapped]
        public string FileNameExtension
        {
            get
            {
                var extension =
                    (this.ExecutionStrategyType.GetFileExtension()
                        ?? this.CompilerType.GetFileExtension()) ?? string.Empty;

                return extension;
            }
        }

        public override string ToString() => this.Name;
    }
}