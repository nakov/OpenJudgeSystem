namespace OJS.Servers.Worker.Models.ExecutionResult.Output
{
    using System.Collections.Generic;
    using System.Linq;
    using OJS.Services.Common.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class TaskResultResponseModel : IMapFrom<TaskResultServiceModel>
    {
        private const string ExecutionTimeValue = "just now";

        public int Points { get; set; }

        // public static string TimeElapsedFormatted => ExecutionTimeValue;

        public IEnumerable<TestResultResponseModel> TestResults { get; set; } = Enumerable.Empty<TestResultResponseModel>();
    }
}