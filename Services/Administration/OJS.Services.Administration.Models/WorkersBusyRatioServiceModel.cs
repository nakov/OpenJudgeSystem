namespace OJS.Services.Administration.Models;

using System;

public class WorkersBusyRatioServiceModel
{
    public double ExponentialMovingAverageRatio { get; set; }

    public double RollingAverageRatio { get; set; }

    public int SubmissionsAwaitingExecution { get; set; }

    public int WorkersTotalCount { get; set; }

    public TimeSpan SampleDuration { get; set; }
}