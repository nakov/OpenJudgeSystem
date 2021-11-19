namespace OJS.Services.Ui.Models.Contests
{
    using OJS.Data.Models.Contests;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System;

    public class ContestForHomeIndexServiceModel : IMapFrom<Contest>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime? EndTime { get; set; }
    }
}