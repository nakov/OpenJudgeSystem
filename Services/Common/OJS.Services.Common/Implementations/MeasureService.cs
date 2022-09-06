namespace OJS.Services.Common.Implementations;

using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

public class MeasureService
    : IMeasureService
{
    private readonly ILogger<MeasureService> logger;

    public MeasureService(ILogger<MeasureService> logger)
        => this.logger = logger;

    public async Task<T> Measure<T>(Func<Task<T>> func, string name)
    {
        var start = DateTime.Now;
        var result = await func();
        var end = DateTime.Now;
        this.logger.LogCritical($"{name} executed in {end - start}");

        return result;
    }
}