using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Contests
{
    public class ContestProblemResourceServiceModel : IMapFrom<ProblemResource>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Link { get; set; }

        public ProblemResourceType Type { get; set; }
    }
}