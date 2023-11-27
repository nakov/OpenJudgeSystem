namespace OJS.Common.Models;

/// <summary>
/// Details of one difference.
/// </summary>
public struct Difference
{
    /// <summary>
    /// Gets or sets the start Line number in Data A.
    /// </summary>
    public int StartA { get; set; }

    /// <summary>
    /// Gets or sets the start Line number in Data B.
    /// </summary>
    public int StartB { get; set; }

    /// <summary>
    /// Gets or sets the number of changes in Data A.
    /// </summary>
    public int DeletedA { get; set; }

    /// <summary>
    /// Gets or sets the number of changes in Data B.
    /// </summary>
    public int InsertedB { get; set; }
}