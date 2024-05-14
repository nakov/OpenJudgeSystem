namespace OJS.Services.Administration.Models.Checkers;

using OJS.Data.Models.Checkers;
using OJS.Services.Infrastructure.Models.Mapping;
using System;

public class CheckerInListModel : IMapFrom<Checker>
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? DllFile { get; set; }

    public string? ClassName { get; set; }

    public string? Parameter { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }
}