namespace OJS.Services.Worker.Business.Implementations;

using Microsoft.Extensions.Logging;
using OJS.Workers.Common.Helpers;
using System;
using System.Linq;
using System.Net;
using System.Net.Sockets;

public class HostInfoService : IHostInfoService
{
    private readonly ILogger<HostInfoService> logger;

    public HostInfoService(ILogger<HostInfoService> logger)
        => this.logger = logger;

    public string GetHostName()
        => OsPlatformHelpers.IsDocker()
            ? "host.docker.internal"
            : Dns.GetHostName();

    public IPAddress? GetHostIpv4Address()
    {
        var hostName = this.GetHostName();
        IPHostEntry hostEntry;
        try
        {
            hostEntry = Dns.GetHostEntry(hostName);
        }
        catch (Exception)
        {
            this.logger.LogWarning("Failed to get host entry for host name: {HostName}", hostName);
            return null;
        }

        return hostEntry.AddressList
            .FirstOrDefault(ip => ip.AddressFamily == AddressFamily.InterNetwork);
    }
}