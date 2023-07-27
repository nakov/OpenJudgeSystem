using AutoMapper;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

namespace OJS.Services.Common.Models.Submissions
{
    public class ExecutionResultServiceModel
    {
        public string Id { get; set; } = null!;

        public bool IsCompiledSuccessfully { get; set; }

        public string CompilerComment { get; set; } = null!;

        public TaskResultServiceModel TaskResult { get; set; } = null!;

        public OutputResultServiceModel OutputResult { get; set; } = null!;

        public DateTime? StartedExecutionOn { get; set; }
    }
}