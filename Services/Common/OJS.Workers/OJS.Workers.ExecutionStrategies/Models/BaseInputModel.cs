#nullable disable
namespace OJS.Workers.ExecutionStrategies.Models
{
    using OJS.Workers.Common.Extensions;

    public class BaseInputModel
    {
        public byte[] TaskSkeleton { get; set; }

        public string TaskSkeletonAsString => this.TaskSkeleton.Decompress();
    }
}