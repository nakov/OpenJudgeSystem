namespace OJS.Data.Models.Problems
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;
    using OJS.Common.Enumerations;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using SoftUni.Data.Infrastructure.Models;
    using static OJS.Data.Validation.ConstraintConstants;
    using static OJS.Data.Validation.ConstraintConstants.Problem;

    public class ProblemResource : DeletableAuditInfoEntity<int>, IOrderableEntity, IMapExplicitly
    {
        public int ProblemId { get; set; }

        public virtual Problem Problem { get; set; } = null!;

        [Required]
        [MinLength(ResourceNameMinLength)]
        [MaxLength(ResourceNameMaxLength)]
        public string Name { get; set; } = string.Empty;

        public ProblemResourceType Type { get; set; }

        public byte[]? File { get; set; }

        [MaxLength(FileExtensionMaxLength)]
        public string? FileExtension { get; set; }

        public string? Link { get; set; }

        public double OrderBy { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<ProblemResource, ProblemResource>()
                .ForMember(
                    d => d.Id,
                    opt => opt.MapFrom(src => 0));
    }
}