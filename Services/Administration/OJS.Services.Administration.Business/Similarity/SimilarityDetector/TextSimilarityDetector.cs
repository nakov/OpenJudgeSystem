namespace OJS.Services.Administration.Business.Similarity.SimilarityDetector;

using OJS.Services.Administration.Models.Similarity;
using System.Collections.Generic;
using System.Linq;

public class TextSimilarityDetector : ISimilarityDetector
{
    private readonly ISimilarityFinder similarityFinder;

    public TextSimilarityDetector(ISimilarityFinder similarityFinder)
        => this.similarityFinder = similarityFinder;

    public SimilarityResult DetectPlagiarism(
        string firstSource,
        string secondSource,
        IEnumerable<IDetectSimilarityVisitor>? visitors = null)
    {
        if (visitors != null)
        {
            foreach (var visitor in visitors)
            {
                firstSource = visitor.Visit(firstSource);
                secondSource = visitor.Visit(secondSource);
            }
        }

        var differences = this.similarityFinder.DiffText(firstSource, secondSource, true, true, true);

        var differencesCount = differences.Sum(difference => difference.DeletedA + difference.InsertedB);
        var textLength = firstSource.Length + secondSource.Length;

        // TODO: Revert the percentage
        var percentage = ((decimal)differencesCount * 100) / textLength;

        return new SimilarityResult(percentage)
        {
            Differences = differences,
            FirstToCompare = firstSource,
            SecondToCompare = secondSource,
        };
    }
}