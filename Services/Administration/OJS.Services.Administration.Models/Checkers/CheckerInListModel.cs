namespace OJS.Services.Administration.Models.Checkers;

using OJS.Data.Models.Checkers;
using SoftUni.AutoMapper.Infrastructure.Models;

public class CheckerInListModel : IMapFrom<Checker>
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? DllFile { get; set; }

    public string? ClassName { get; set; }

    public string? Parameter { get; set; }
}