namespace OJS.Services.Administration.Models.AntiCheat;

using System;

public class SubmissionSimilarityServiceModel
{
    public string ProblemName { get; set; } = string.Empty;

    public int Points { get; set; }

    public int Differences { get; set; }

    public decimal Percentage { get; set; }

    public int FirstSubmissionId { get; set; }

    public int SecondSubmissionId { get; set; }

    public string FirstParticipantName { get; set; } = string.Empty;

    public string SecondParticipantName { get; set; } = string.Empty;

    public DateTime FirstSubmissionCreatedOn { get; set; }

    public DateTime SecondSubmissionCreatedOn { get; set; }
}