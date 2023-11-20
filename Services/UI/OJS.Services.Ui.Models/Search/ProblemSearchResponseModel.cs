namespace OJS.Services.Ui.Models.Search;

using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemSearchResponseModel : IMapFrom<ProblemSearchServiceModel>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public double OrderBy { get; set; }

    public ProblemContestSearchServiceModel? Contest { get; set; }
}