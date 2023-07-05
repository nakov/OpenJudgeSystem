namespace OJS.Servers.Worker.Models.ExecutionResult.Output
{
    using System.Collections.Generic;
    using OJS.Services.Worker.Models.ExecutionResult.Output;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System.Linq;

    public class TaskResultResponseModel : IMapFrom<TaskResultServiceModel>
    {
        private const string ExecutionTimeValue = "just now";

        public int Points { get; set; }

        // public static string TimeElapsedFormatted => ExecutionTimeValue;

        public IEnumerable<TestResultResponseModel> TestResults { get; set; } = Enumerable.Empty<TestResultResponseModel>();
    }
}