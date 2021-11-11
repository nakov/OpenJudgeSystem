namespace OJS.Servers.Ui.Models.Home
{
    using OJS.Services.Infrastructure.Mapping;
    using OJS.Services.Ui.Models.Contests;
    using System;

    public class HomeContestViewModel : IMapFrom<ContestForHomeIndexServiceModel>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime? EndTime { get; set; }
    }
}