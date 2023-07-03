namespace OJS.Servers.Worker.Models.ExecutionContext.ExecutionDetails;
{
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class SimpleExecutionDetailsRequestModel : IMapTo<SimpleExecutionDetailsServiceModel>
    {
        public string Input { get; set; }

        public byte[] TaskSkeleton { get; set; }

        public string TaskSkeletonAsString { get; set; }
    }
}
