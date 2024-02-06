namespace OJS.Services.Administration.Models.SubmissionsForProcessing;

using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionsForProcessingAdministrationServiceModel : IMapFrom<SubmissionForProcessing>
{
    public int Id { get; set; }

    public int SubmissionId { get; set; }

    public bool Processing { get; set; }

    public bool Processed { get; set; }

    public string? SerializedExecutionDetails { get; set; }

    public string? SerializedExecutionResult { get; set; }

    public string? SerializedException { get; set; }
}