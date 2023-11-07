namespace OJS.Services.Administration.Models.ParticipantScores.Models;

using System.Collections.Generic;

public class CategoryContestsParticipationSummary
{
    public int MaxProblemsCount { get; set; }

    public ICollection<ParticipantScoresSummaryModel>? Results { get; set; }
}