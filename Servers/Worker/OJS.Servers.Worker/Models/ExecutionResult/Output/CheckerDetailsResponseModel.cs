namespace OJS.Servers.Worker.Models.ExecutionResult.Output;

using OJS.Workers.Common;
using OJS.Services.Infrastructure.Models.Mapping;

public class CheckerDetailsResponseModel
    : IMapFrom<CheckerDetails>
{
    public string? Comment { get; set; }

    public string? ExpectedOutputFragment { get; set; }

    public string? UserOutputFragment { get; set; }
}