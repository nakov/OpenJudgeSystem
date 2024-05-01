namespace OJS.Services.Ui.Models.Search;

using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemSearchResponseModel : IMapFrom<ProblemSearchServiceModel>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public double OrderBy { get; set; }

    public ProblemContestSearchServiceModel? Contest { get; set; }
}