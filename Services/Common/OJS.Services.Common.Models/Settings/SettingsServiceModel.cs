namespace OJS.Services.Common.Models.Settings;

using Infrastructure.Models.Mapping;
using OJS.Common.Enumerations;
using OJS.Data.Models;

public class SettingServiceModel : IMapTo<Setting>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    public SettingType Type { get; set; }
}