namespace OJS.Services.Administration.Models.AntiCheat;

using SoftUni.Judge.Common.Enumerations;

public class SubmissionSimilarityFiltersServiceModel
{
    public int ContestId { get; set; }

    public PlagiarismDetectorType PlagiarismDetectorType { get; set; }
}