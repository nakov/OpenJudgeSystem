namespace OJS.Servers.Worker.Models.ExecutionContext.ExecutionDetails;

using AutoMapper;
using OJS.Workers.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class TestContextRequestModel : IMapExplicitly
{
    public int Id { get; set; }

    public string? Input { get; set; }

    public string? Output { get; set; }

    public bool IsTrialTest { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<TestContextRequestModel, TestContext>()
            .ForMember(s => s.OrderBy, opt => opt.Ignore());
}
