namespace OJS.Services.Ui.Models.Contests
{
    using OJS.Common.Enumerations;
    using OJS.Data.Models.Problems;
    using OJS.Services.Infrastructure.Models.Mapping;
    using OJS.Services.Ui.Models.Cache;

    public class ContestProblemResourceServiceModel : IMapFrom<ProblemResourceCacheModel>
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Link { get; set; } = null!;

        public ProblemResourceType Type { get; set; }
    }
}