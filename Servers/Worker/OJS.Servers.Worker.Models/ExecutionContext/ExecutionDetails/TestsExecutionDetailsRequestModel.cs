namespace OJS.Servers.Worker.Models.ExecutionContext.ExecutionDetails
{
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System.Collections.Generic;

    public class TestsExecutionDetailsRequestModel : IMapTo<TestsExecutionDetailsServiceModel>
    {
        public int? MaxPoints { get; set; }

        public string TaskId { get; set; }

        public int? ExamParticipantId { get; set; }

        public string CheckerType { get; set; }

        public string CheckerParameter { get; set; }

        public byte[] TaskSkeleton { get; set; }

        public string TaskSkeletonAsString { get; set; }

        public IEnumerable<TestContextRequestModel> Tests { get; set; }
    }
}
