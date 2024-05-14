namespace OJS.Services.Administration.Models.Settings;

using AutoMapper;
using OJS.Common.Enumerations;
using OJS.Data.Models;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class SettingAdministrationModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public string? Name { get; set; }

    public string? Value { get; set; }

    public string? Type { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<Setting, SettingAdministrationModel>()
            .ForMember(x => x.OperationType, opt => opt.Ignore());

        configuration.CreateMap<SettingAdministrationModel, Setting>();
    }
}