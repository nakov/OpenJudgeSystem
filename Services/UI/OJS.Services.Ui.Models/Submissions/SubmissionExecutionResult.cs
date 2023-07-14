using OJS.Services.Common.Models;
using OJS.Services.Common.Models.PubSubContracts.ExecutionResult;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions
{
    public class SubmissionExecutionResult : IMapFrom<SubmissionProcessed>
    {
        public int SubmissionId { get; set; }

        public ExceptionModel? Exception { get; set; }

        public ExecutionResultResponseModel? ExecutionResult { get; set; }
    }
}