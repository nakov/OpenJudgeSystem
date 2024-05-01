namespace OJS.Services.Administration.Business.Settings;

using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Services.Administration.Models.Settings;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Extensions;
using System.Threading.Tasks;

public class SettingsBusinessService : AdministrationOperationService<Setting, int, SettingAdministrationModel>, ISettingsBusinessService
{
    private readonly IDataService<Setting> settingsService;

    public SettingsBusinessService(IDataService<Setting> settingsService) => this.settingsService = settingsService;

    public override async Task<SettingAdministrationModel> Get(int id)
        => await this.settingsService.GetByIdQuery(id).FirstAsync().Map<SettingAdministrationModel>();

    public override async Task<SettingAdministrationModel> Create(SettingAdministrationModel model)
    {
        var setting = model.Map<Setting>();

        await this.settingsService.Add(setting);
        await this.settingsService.SaveChanges();

        return model;
    }

    public override async Task<SettingAdministrationModel> Edit(SettingAdministrationModel model)
    {
        var setting = await this.settingsService.GetByIdQuery(model.Id).FirstAsync();

        setting = setting.MapFrom(model);

        this.settingsService.Update(setting);
        await this.settingsService.SaveChanges();

        return model;
    }

    public override async Task Delete(int id)
    {
        await this.settingsService.DeleteById(id);
        await this.settingsService.SaveChanges();
    }
}