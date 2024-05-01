namespace OJS.Servers.Ui.Models.Contests
{
    using System;
    using OJS.Services.Ui.Models.Contests;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class ContestForHomeIndexResponseModel : IMapFrom<ContestForHomeIndexServiceModel>
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public DateTime? PracticeStartTime { get; set; }

        public DateTime? PracticeEndTime { get; set; }

        public bool CanBeCompeted { get; set; }

        public bool CanBePracticed { get; set; }

        public bool HasContestPassword { get; set; }

        public bool HasPracticePassword { get; set; }

        public string Category { get; set; } = null!;
    }
}