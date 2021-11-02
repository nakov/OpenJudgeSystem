namespace OJS.Data.Models.Problems
{
    using OJS.Common.Enumerations;
    using OJS.Data.Infrastructure.Models;
    using OJS.Data.Models.Contests;
    using System.Collections.Generic;

    public class ProblemGroup : DeletableEntity<int>, IOrderableEntity
    {
        public int ContestId { get; set; }

        public Contest Contest { get; set; }

        public double OrderBy { get; set; }

        public ProblemGroupType? Type { get; set; }

        public ICollection<Problem> Problems { get; set; } = new HashSet<Problem>();
    }
}