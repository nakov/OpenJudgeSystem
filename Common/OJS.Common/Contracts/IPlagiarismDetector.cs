namespace OJS.Common.Contracts;

using OJS.Common.Models;
using System.Collections.Generic;

public interface IPlagiarismDetector
{
    PlagiarismResult DetectPlagiarism(
        string firstSource,
        string secondSource,
        IEnumerable<IDetectPlagiarismVisitor>? visitors = null);
}