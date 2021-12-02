namespace OJS.Data.Models.Problems
{
    using OJS.Common.Enumerations;
    using SoftUni.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using System.Collections.Generic;

    public class ProblemGroup : DeletableAuditInfoEntity<int>, IOrderableEntity
    {
        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; }

        public double OrderBy { get; set; }

        public ProblemGroupType? Type { get; set; }

        public virtual ICollection<Problem> Problems { get; set; } = new HashSet<Problem>();
    }
}