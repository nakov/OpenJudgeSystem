﻿namespace OJS.Services.Worker.Models.ExecutionContext
{
    using System;
    using OJS.Services.Worker.Models.ExecutionContext.ExecutionDetails;
    using OJS.Services.Worker.Models.ExecutionContext.Mapping;
    using OJS.Workers.Common.Models;
    using OJS.Workers.SubmissionProcessors.Models;

    public class SubmissionServiceModel : IMapExplicitly
    {
        public ExecutionType ExecutionType { get; set; }

        public ExecutionStrategyType ExecutionStrategyType { get; set; }

        public byte[] FileContent { get; set; }

        public string Code { get; set; }

        public int TimeLimit { get; set; }

        public int MemoryLimit { get; set; }

        public SimpleExecutionDetailsServiceModel SimpleExecutionDetails { get; set; }

        public TestsExecutionDetailsServiceModel TestsExecutionDetails { get; set; }

        public ExecutionOptionsServiceModel ExecutionOptions { get; set; }

        public DateTime? StartedExecutionOn { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration
                .CreateMap(typeof(SubmissionServiceModel), typeof(OjsSubmission<>))
                .ForMember(
                    nameof(OjsSubmission<object>.ExecutionType),
                    opt => opt.ResolveUsing(typeof(ExecutionTypeValueResolver)))
                .ForMember(
                    nameof(OjsSubmission<object>.Input),
                    opt => opt.ResolveUsing(typeof(SubmissionInputValueResolver)));
    }
}
