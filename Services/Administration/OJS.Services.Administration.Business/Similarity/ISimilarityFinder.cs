namespace OJS.Services.Administration.Business.Similarity;

using OJS.Services.Administration.Models.Similarity;
using OJS.Services.Infrastructure;

public interface ISimilarityFinder : IService
{
    /// <summary>
    /// Find the difference in 2 text documents, comparing by text lines.
    /// The algorithm itself is comparing 2 arrays of numbers so when comparing 2 text documents
    /// each line is converted into a (hash) number. This hash-value is computed by storing all
    /// text lines into a common hashtable so i can find duplicates in there, and generating a
    /// new number each time a new text-line is inserted.
    /// </summary>
    /// <param name="textA">A-version of the text (usually the old one).</param>
    /// <param name="textB">B-version of the text (usually the new one).</param>
    /// <param name="trimSpace">When set to true, all leading and trailing whitespace characters are stripped out before the comparator is done.</param>
    /// <param name="ignoreSpace">When set to true, all whitespace characters are converted to a single space character before the comparator is done.</param>
    /// <param name="ignoreCase">When set to true, all characters are converted to their lowercase equivalent before the comparator is done.</param>
    /// <returns>Returns a array of Items that describe the differences.</returns>
    Difference[] DiffText(
        string textA,
        string textB,
        bool trimSpace,
        bool ignoreSpace,
        bool ignoreCase);

    /// <summary>
    /// Find the difference in 2 arrays of integers.
    /// </summary>
    /// <param name="arrayA">A-version of the numbers (usually the old one). </param>
    /// <param name="arrayB">B-version of the numbers (usually the new one). </param>
    /// <returns>Returns an array of Items that describe the differences.</returns>
    Difference[] DiffInt(int[] arrayA, int[] arrayB);
}