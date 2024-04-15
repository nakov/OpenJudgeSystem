namespace OJS.Services.Administration.Models.Contests;

using OJS.Services.Common.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ContestActivityModel : IMapFrom<ContestActivityServiceModel>
{
    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }
}