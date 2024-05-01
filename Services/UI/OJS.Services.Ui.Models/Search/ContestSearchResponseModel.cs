namespace OJS.Services.Ui.Models.Search;

using System;
using OJS.Services.Infrastructure.Models.Mapping;

public class ContestSearchResponseModel : IMapFrom<ContestSearchServiceModel>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? PracticeStartTime { get; set; }

    public DateTime? PracticeEndTime { get; set; }

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }

    public string Category { get; set; } = string.Empty;
}