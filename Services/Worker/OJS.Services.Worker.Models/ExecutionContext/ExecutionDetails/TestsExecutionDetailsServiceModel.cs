using OJS.Services.Worker.Models.ExecutionContext.Mapping;

namespace OJS.Services.Worker.Models.ExecutionContext.ExecutionDetails
{
    using OJS.Workers.ExecutionStrategies.Models;
    using System.Collections.Generic;

    public class TestsExecutionDetailsServiceModel
        : BaseExecutionDetailsServiceModel,
            IMapTo<TestsInputModel>,
            IMapExplicitly
    {
        public int? MaxPoints { get; set; }

        public string TaskId { get; set; }

        public int? ExamParticipantId { get; set; }

        public string CheckerType { get; set; }

        public string CheckerParameter { get; set; }

        public IEnumerable<TestContext> Tests { get; set; }

        public void RegisterMappings(IProfileExpression configuration)
            => configuration
                .CreateMap<TestsExecutionDetailsServiceModel, TestsInputModel>()
                .ForMember(
                    m => m.CheckerTypeName,
                    opt => opt.ResolveUsing<CheckerTypeNameValueResolver>())
                .ForMember(
                    m => m.CheckerParameter,
                    opt => opt.MapFrom(y => y.CheckerParameter))
                .ForMember(
                    m => m.TaskSkeleton,
                    opt => opt.ResolveUsing<TaskSkeletonValueResolver<TestsExecutionDetailsServiceModel>>());
    }
}
