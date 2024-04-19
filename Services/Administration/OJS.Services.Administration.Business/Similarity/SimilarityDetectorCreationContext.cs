namespace OJS.Services.Administration.Business.Similarity;

using OJS.Common.Enumerations;
using System;

public class SimilarityDetectorCreationContext
{
    public SimilarityDetectorCreationContext(SimilarityCheckType type, ISimilarityFinder similarityFinder)
    {
        if (similarityFinder == null)
        {
            throw new ArgumentNullException(nameof(similarityFinder));
        }

        this.Type = type;
        this.SimilarityFinder = similarityFinder;
    }

    public SimilarityCheckType Type { get; set; }

    public string? CompilerPath { get; set; }

    public string? DisassemblerPath { get; set; }

    public ISimilarityFinder SimilarityFinder { get; set; }
}