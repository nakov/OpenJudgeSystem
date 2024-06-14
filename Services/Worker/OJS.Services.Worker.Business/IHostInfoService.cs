namespace OJS.Services.Worker.Business;

using OJS.Services.Infrastructure;
using System.Net;

public interface IHostInfoService : ISingletonService
{
    string GetHostName();

    IPAddress? GetHostIpv4Address();
}