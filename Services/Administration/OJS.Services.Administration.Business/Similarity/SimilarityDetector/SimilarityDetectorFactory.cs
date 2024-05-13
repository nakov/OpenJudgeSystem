namespace OJS.Services.Administration.Business.Similarity.SimilarityDetector;

using OJS.Common.Enumerations;
using System;

public class SimilarityDetectorFactory : ISimilarityDetectorFactory
{
        public ISimilarityDetector CreatePlagiarismDetector(SimilarityDetectorCreationContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            switch (context.Type)
            {
                case SimilarityCheckType.Text:
                    return new TextSimilarityDetector(context.SimilarityFinder);
                default:
                    throw new ArgumentOutOfRangeException(nameof(context), "Invalid plagiarism detector type!");
            }
        }
}