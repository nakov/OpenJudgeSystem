namespace OJS.Data.Models.Problems
{
    using OJS.Common.Enumerations;
    using OJS.Data.Infrastructure.Models;
    using System.ComponentModel.DataAnnotations;
    using static OJS.Data.Validation.ConstraintConstants;
    using static OJS.Data.Validation.ConstraintConstants.Problem;

    public class ProblemResource : DeletableEntity<int>, IOrderableEntity
    {
        public int ProblemId { get; set; }

        public Problem Problem { get; set; }

        [Required]
        [MinLength(ResourceNameMinLength)]
        [MaxLength(ResourceNameMaxLength)]
        public string Name { get; set; }

        public ProblemResourceType Type { get; set; }

        public byte[] File { get; set; }

        [MaxLength(FileExtensionMaxLength)]
        public string FileExtension { get; set; }

        public string Link { get; set; }

        public double OrderBy { get; set; }
    }
}