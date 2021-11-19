namespace OJS.Servers.Ui.Models.Home
{
    using OJS.Services.Ui.Models.Contests;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System;

    public class HomeContestViewModel : IMapFrom<ContestForHomeIndexServiceModel>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime? EndTime { get; set; }
    }
}