namespace OJS.Services.Worker.Business;

using OJS.Services.Infrastructure;

public interface IHostInfoService : ISingletonService
{
    string? GetHostIp();
}