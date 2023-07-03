namespace OJS.Servers.Worker.Models.ExecutionContext.ExecutionDetails;

using SoftUni.AutoMapper.Infrastructure.Models;

public class TestContextRequestModel : IMapTo<TestContext>
{
    public int Id { get; set; }

    public string Input { get; set; }

    public string Output { get; set; }

    public bool IsTrialTest { get; set; }
}
