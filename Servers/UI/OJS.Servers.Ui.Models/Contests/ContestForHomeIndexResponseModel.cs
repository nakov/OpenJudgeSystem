namespace OJS.Servers.Ui.Models.Contests
{
    using System;
    using OJS.Services.Ui.Models.Contests;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class ContestForHomeIndexResponseModel : IMapFrom<ContestForHomeIndexServiceModel>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime? EndTime { get; set; }

        public bool CanCompete { get; set; }

        public bool CanPractice { get; set; }

        public string Category { get; set; }
    }
}