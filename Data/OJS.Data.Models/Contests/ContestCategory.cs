namespace OJS.Data.Models.Contests
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using OJS.Data.Models.Common;
    using static OJS.Data.Validation.ConstraintConstants.Contest;

    public class ContestCategory : DeletableAuditInfoEntity<int>, IOrderableEntity, IVisibleEntity
    {
        [Required]
        [MaxLength(CategoryNameMaxLength)]
        [MinLength(CategoryNameMinLength)]
        public string Name { get; set; } = string.Empty;

        public double OrderBy { get; set; }

        public int? ParentId { get; set; }

        public virtual ContestCategory? Parent { get; set; }

        public bool IsVisible { get; set; }

        [InverseProperty(nameof(Parent))]
        public virtual ICollection<ContestCategory> Children { get; set; } = new HashSet<ContestCategory>();

        public virtual ICollection<Contest> Contests { get; set; } = new HashSet<Contest>();

        public virtual ICollection<LecturerInContestCategory> LecturersInContestCategories { get; set; } =
            new HashSet<LecturerInContestCategory>();

        public override string ToString() => this.Name;
    }
}