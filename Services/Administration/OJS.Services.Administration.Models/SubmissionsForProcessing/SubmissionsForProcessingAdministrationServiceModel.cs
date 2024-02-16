namespace OJS.Services.Administration.Models.SubmissionsForProcessing;

using System;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionsForProcessingAdministrationServiceModel : BaseAdministrationModel<int>, IMapFrom<SubmissionForProcessing>
{
    public int SubmissionId { get; set; }

    public bool Processing { get; set; }

    public bool Processed { get; set; }

    public string? SerializedExecutionDetails { get; set; }

    public string? SerializedExecutionResult { get; set; }

    public string? SerializedException { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }
}