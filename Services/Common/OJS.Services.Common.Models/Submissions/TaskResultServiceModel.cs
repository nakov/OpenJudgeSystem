using System.Collections.Generic;

namespace OJS.Services.Common.Models.Submissions;

public class TaskResultServiceModel
{
    public int Points { get; set; }

    public IEnumerable<TestResultServiceModel> TestResults { get; set; } = null!;
}