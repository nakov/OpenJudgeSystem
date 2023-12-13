namespace OJS.Services.Administration.Models.ParticipantScores.Models;

public class ParticipantSummarySubmissionInfoServiceModel
{
    public int ProblemGroup { get; set; }
    public double TimeTaken { get; set; }

    // Submission content rows count
    public int Length { get; set; }
}