namespace OJS.Services.Ui.Models.Search;

using System.Collections.Generic;

public class ProblemSearchServiceResultModel
{
    public IEnumerable<ProblemSearchServiceModel> Problems { get; set; } = null!;

    public int TotalProblemsCount { get; set; }
}