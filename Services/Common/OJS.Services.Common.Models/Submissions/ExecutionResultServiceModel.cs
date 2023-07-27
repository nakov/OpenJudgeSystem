using AutoMapper;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

namespace OJS.Services.Common.Models.Submissions
{
    public class ExecutionResultServiceModel
    {
        public string Id { get; set; } = null!;

        public bool IsCompiledSuccessfully { get; set; }

        public string CompilerComment { get; set; } = string.Empty;

        public TaskResultServiceModel? TaskResult { get; set; }

        public OutputResultServiceModel? OutputResult { get; set; }

        public DateTime? StartedExecutionOn { get; set; }
    }
}