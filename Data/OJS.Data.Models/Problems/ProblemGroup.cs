namespace OJS.Data.Models.Problems
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using AutoMapper;
    using OJS.Common.Enumerations;
    using OJS.Data.Models.Contests;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using SoftUni.Data.Infrastructure.Models;

    public class ProblemGroup : DeletableAuditInfoEntity<int>, IOrderableEntity, IMapExplicitly
    {
        public int ContestId { get; set; }

        public virtual Contest Contest { get; set; } = null!;

        public double OrderBy { get; set; }

        public ProblemGroupType? Type { get; set; }

        public virtual ICollection<Problem> Problems { get; set; } = new HashSet<Problem>();

        public override string ToString() => $"{this.OrderBy}";

        public void RegisterMappings(IProfileExpression configuration)
            => configuration.CreateMap<ProblemGroup, ProblemGroup>()
                .ForMember(
                    d => d.Id,
                    opt => opt.MapFrom(src => 0))
                .ForMember(
                    d => d.CreatedOn,
                    opt => opt.MapFrom(src => (DateTime?)null))
                .ForMember(
                    d => d.ModifiedOn,
                    opt => opt.MapFrom(src => (DateTime?)null))
                .ForMember(
                    d => d.Problems,
                    opt => opt.MapFrom(src => Enumerable.Empty<Problem>()));
    }
}