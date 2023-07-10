namespace OJS.Services.Worker.Models.ExecutionContext.ExecutionDetails
{
    using System.Collections.Generic;
    using System.Linq;
    using AutoMapper;
    using OJS.Services.Worker.Models.ExecutionContext.Mapping;
    using OJS.Workers.ExecutionStrategies.Models;
    using SoftUni.AutoMapper.Infrastructure.Models;

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
                .ForMember(
                    m => m.CheckerTypeName,
                    opt => opt.MapFrom<CheckerTypeNameValueResolver>())
                .ForMember(
                    m => m.CheckerParameter,
                    opt => opt.MapFrom(y => y.CheckerParameter))
                .ForMember(
                    m => m.TaskSkeleton,
                    opt => opt.MapFrom<TaskSkeletonValueResolver<TestsExecutionDetailsServiceModel>>())
                .ForAllOtherMembers(opt => opt.Ignore());
    }
}
