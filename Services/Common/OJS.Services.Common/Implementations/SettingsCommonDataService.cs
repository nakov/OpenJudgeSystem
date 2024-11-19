namespace OJS.Services.Common.Implementations;

using Data.Implementations;
using Infrastructure.Constants;
using Infrastructure.Extensions;
using Microsoft.Extensions.Logging;
using Models.Settings;
using OJS.Data;
using OJS.Data.Models;
using System.Threading.Tasks;

public class SettingsCommonDataService(ILogger<SettingsCommonDataService> logger, OjsDbContext db)
    : DataService<Setting>(db), ISettingsCommonDataService
{
    public async Task CreateIfNotExists(SettingServiceModel model)
    {
        var exists = await this.Exists(s => model.Name == s.Name);

        if (exists)
        {
            logger.LogSettingExistsSkipAdding(model.Name);

            return;
        }

        await this.Add(model.Map<Setting>());
        await this.SaveChanges();

        logger.LogAddedSetting(model.Name);
    }
}