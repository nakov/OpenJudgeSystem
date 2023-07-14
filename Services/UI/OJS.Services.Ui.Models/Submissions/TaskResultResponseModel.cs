using OJS.Services.Common.Models.PubSubContracts.ExecutionResult;
using SoftUni.AutoMapper.Infrastructure.Models;

namespace OJS.Services.Ui.Models.Submissions;

using System.Collections.Generic;

public class TaskResultResponseModel : IMapFrom<TaskResult>
{
    public int Points { get; set; }

    public IEnumerable<TestResultResponseModel> TestResults { get; set; } = null!;
}