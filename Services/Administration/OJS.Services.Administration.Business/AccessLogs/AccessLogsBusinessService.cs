namespace OJS.Services.Administration.Business.AccessLogs;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Services.Administration.Models.AccessLogs;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;

public class AccessLogsBusinessService : AdministrationOperationService<AccessLog, int, AccessLogAdministrationModel>, IAccessLogsBusinessService
{
    private readonly IDataService<AccessLog> accessLogsData;

    public AccessLogsBusinessService(IDataService<AccessLog> accessLogsData)
        => this.accessLogsData = accessLogsData;

    public override async Task<AccessLogAdministrationModel> Get(int id)
    {
        var accessLog = await this.accessLogsData
            .GetByIdQuery(id)
            .FirstOrDefaultAsync();

        if (accessLog == null)
        {
            throw new BusinessServiceException($"The access log with Id {id} was not found");
        }

        return accessLog.Map<AccessLogAdministrationModel>();
    }
}