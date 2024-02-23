namespace OJS.Services.Administration.Models.Problems;

public class CopyProblemRequestModel
{
    public int DestinationContestId { get; set; }

    public int? ProblemGroupId { get; set; }

    public int ProblemId { get; set; }
}