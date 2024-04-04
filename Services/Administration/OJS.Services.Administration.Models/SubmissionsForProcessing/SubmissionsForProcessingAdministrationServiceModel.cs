using OJS.Services.Common.Models;

namespace OJS.Services.Administration.Models.SubmissionsForProcessing;

using AutoMapper;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;
using System;

public class SubmissionsForProcessingAdministrationServiceModel : BaseAdministrationModel<int>, IMapExplicitly
{
    public int SubmissionId { get; set; }

    public bool Processing { get; set; }

    public bool Processed { get; set; }

    public string? SerializedExecutionDetails { get; set; }

    public string? SerializedExecutionResult { get; set; }

    public string? SerializedException { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<SubmissionForProcessing, SubmissionsForProcessingAdministrationServiceModel>()
            .ForMember(sfpam => sfpam.OperationType, opt
                => opt.Ignore());
}