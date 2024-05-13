namespace OJS.Services.Administration.Models.Similarity;

public struct Difference
{
    /// <summary>
    /// Gets or sets start Line number in Data A.
    /// </summary>
    public int StartA { get; set; }

    /// <summary>
    /// Gets or sets start Line number in Data B.
    /// </summary>
    public int StartB { get; set; }

    /// <summary>
    /// Gets or sets number of changes in Data A.
    /// </summary>
    public int DeletedA { get; set; }

    /// <summary>
    /// Gets or sets number of changes in Data B.
    /// </summary>
    public int InsertedB { get; set; }
}