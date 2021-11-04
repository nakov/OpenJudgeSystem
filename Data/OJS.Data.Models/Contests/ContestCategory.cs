namespace OJS.Data.Models.Contests
{
    using OJS.Data.Infrastructure.Models;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using static OJS.Data.Validation.ConstraintConstants.Contest;

    public class ContestCategory : DeletableAuditInfoEntity<int>, IOrderableEntity, IVisibleEntity
    {
        [Required]
        [MaxLength(CategoryNameMaxLength)]
        [MinLength(CategoryNameMinLength)]
        public string Name { get; set; }

        public double OrderBy { get; set; }

        public int? ParentId { get; set; }

        public ContestCategory Parent { get; set; }

        public bool IsVisible { get; set; }

        [InverseProperty(nameof(Parent))]
        public ICollection<ContestCategory> Children { get; set; } = new HashSet<ContestCategory>();

        public ICollection<Contest> Contests { get; set; } = new HashSet<Contest>();

        public ICollection<LecturerInContestCategory> LecturersInContestCategories { get; set; } =
            new HashSet<LecturerInContestCategory>();
    }
}