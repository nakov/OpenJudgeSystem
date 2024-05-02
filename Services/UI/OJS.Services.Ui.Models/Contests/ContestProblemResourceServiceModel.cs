namespace OJS.Services.Ui.Models.Contests
{
    using OJS.Common.Enumerations;
    using OJS.Data.Models.Problems;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class ContestProblemResourceServiceModel : IMapFrom<ProblemResource>
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Link { get; set; } = null!;

        public ProblemResourceType Type { get; set; }
    }
}