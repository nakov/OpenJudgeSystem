namespace OJS.Services.Administration.Models.Problems;

public class ProblemRetestValidationModel
{
    public int SubmissionsCount { get; set; }

    public double AverageExecutionTime { get; set; }

    public bool RetestAllowed { get; set; }

    public string Message { get; set; } = string.Empty;
}