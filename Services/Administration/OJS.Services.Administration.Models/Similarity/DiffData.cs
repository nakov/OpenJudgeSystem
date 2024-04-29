namespace OJS.Services.Administration.Models.Similarity;

/// <summary>
/// Data on one input file being compared.
/// </summary>
public class DiffData
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DiffData"/> class.
    /// </summary>
    /// <param name="initData">reference to the buffer.</param>
    public DiffData(int[] initData)
    {
        this.Data = initData;
        this.Length = initData.Length;
        this.Modified = new bool[this.Length + 2];
    }

    /// <summary>
    /// Gets or sets number of elements (lines).
    /// </summary>
    public int Length { get; set; }

    /// <summary>
    /// Gets or sets buffer of numbers that will be compared.
    /// </summary>
    public int[] Data { get; set; }

    /// <summary>
    /// Gets or sets array of booleans that flag for modified data.
    /// This is the result of the diff.
    /// This means deletedA in the first Data or inserted in the second Data.
    /// </summary>
    public bool[] Modified { get; set; }
}