namespace OJS.Common.Models;

using System.Collections.Generic;

public class PlagiarismResult
{
    public PlagiarismResult(decimal? similarityPercentage) => this.SimilarityPercentage = similarityPercentage;

    public decimal? SimilarityPercentage { get; set; }

    public string? FirstToCompare { get; set; }

    public string? SecondToCompare { get; set; }

    public IReadOnlyCollection<Difference>? Differences { get; set; }
}