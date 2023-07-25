﻿namespace OJS.Servers.Worker.Models.ExecutionResult;

using System;
using SoftUni.AutoMapper.Infrastructure.Models;
using OJS.Services.Worker.Models.ExecutionResult;
using OJS.Servers.Worker.Models.ExecutionResult.Output;

public class ExecutionResultResponseModel : IMapFrom<ExecutionResultServiceModel>
{
    public string? Id { get; set; }

    public bool IsCompiledSuccessfully { get; set; }

    public string? CompilerComment { get; set; }

    public OutputResultResponseModel? OutputResult { get; set; }

    public TaskResultResponseModel? TaskResult { get; set; }

    public DateTime? StartedExecutionOn { get; set; }
}
