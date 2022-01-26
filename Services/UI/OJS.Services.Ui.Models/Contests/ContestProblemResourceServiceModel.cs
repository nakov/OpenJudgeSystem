using OJS.Common.Enumerations;

namespace OJS.Services.Ui.Models.Contests
{
    public class ContestProblemResourceServiceModel
    {
        public int ResourceId { get; set; }

        public string Name { get; set; }

        public string RawLink { get; set; }

        public ProblemResourceType ProblemType { get; set; }
    }
}