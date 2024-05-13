namespace OJS.Services.Administration.Models.Similarity;

using System.Collections.Generic;

public class SimilarityResult
{
    public SimilarityResult(decimal similarityPercentage)
        => this.SimilarityPercentage = similarityPercentage;

    public decimal SimilarityPercentage { get; set; }

    public string? FirstToCompare { get; set; }

    public string? SecondToCompare { get; set; }

    public IReadOnlyCollection<Difference>? Differences { get; set; }
}