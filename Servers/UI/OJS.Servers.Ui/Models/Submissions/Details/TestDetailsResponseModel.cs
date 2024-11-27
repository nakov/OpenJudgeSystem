namespace OJS.Servers.Ui.Models.Submissions.Details;

using OJS.Services.Infrastructure.Models.Mapping;
using OJS.Services.Ui.Models.Submissions;

public class TestDetailsResponseModel : IMapFrom<TestSeparateDetailsServiceModel>
{
    public int Id { get; set; }

    public string? Input { get; set; }
}