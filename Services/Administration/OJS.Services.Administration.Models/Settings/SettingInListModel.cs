namespace OJS.Services.Administration.Models.Settings;

using OJS.Common.Enumerations;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class SettingInListModel : IMapFrom<Setting>
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Value { get; set; }

    public SettingType Type { get; set; }
}