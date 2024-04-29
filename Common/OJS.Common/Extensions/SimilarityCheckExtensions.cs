namespace OJS.Common.Extensions;

using OJS.Common.Enumerations;
using OJS.Workers.Common.Models;
using System;

public static class SimilarityCheckExtensions
{
    public static CompilerType[] GetCompatibleCompilerTypes(this SimilarityCheckType plagiarismDetectorType)
    {
        switch (plagiarismDetectorType)
        {
            case SimilarityCheckType.CSharpDotNetCore:
                return new[] { CompilerType.CSharpDotNetCore };

            case SimilarityCheckType.Java:
                return new[] { CompilerType.Java };

            case SimilarityCheckType.Text:
                return new[]
                {
                    CompilerType.None,
                    CompilerType.CSharpDotNetCore,
                    CompilerType.CPlusPlusGcc,
                    CompilerType.Java,
                };

            default:
                throw new ArgumentOutOfRangeException(
                    nameof(plagiarismDetectorType),
                    plagiarismDetectorType,
                    null);
        }
    }
}