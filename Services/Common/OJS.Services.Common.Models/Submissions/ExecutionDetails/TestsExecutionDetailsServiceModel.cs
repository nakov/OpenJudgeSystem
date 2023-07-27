using AutoMapper;
using OJS.Services.Common.Models.Submissions.ExecutionContext.Mapping;
using OJS.Workers.ExecutionStrategies.Models;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Collections.Generic;
using System.Linq;

namespace OJS.Services.Common.Models.Submissions.ExecutionDetails
{
    public class TestsExecutionDetailsServiceModel
        : BaseExecutionDetailsServiceModel,
            IMapExplicitly
    {
        public int? MaxPoints { get; set; }

        public string? TaskId { get; set; }

        public int? ExamParticipantId { get; set; }

        public string? CheckerType { get; set; }

        public string? CheckerParameter { get; set; }

        public IEnumerable<TestContext> Tests { get; set; } = Enumerable.Empty<TestContext>();

        public void RegisterMappings(IProfileExpression configuration)
            => configuration
                .CreateMap<TestsExecutionDetailsServiceModel, TestsInputModel>()
                .ForMember(m => m.Tests, opt => opt.MapFrom(s => s.Tests))
                .ForMember(
                    m => m.CheckerParameter,
                    opt => opt.MapFrom(y => y.CheckerParameter))
                .ForMember(
                    m => m.CheckerTypeName,
                    opt => opt.MapFrom(y => y.CheckerType))
                .ForMember(
                    m => m.TaskSkeleton,
                    opt => opt.MapFrom<TaskSkeletonValueResolver<TestsExecutionDetailsServiceModel>>())
                .ForAllOtherMembers(opt => opt.Ignore());
    }
}
