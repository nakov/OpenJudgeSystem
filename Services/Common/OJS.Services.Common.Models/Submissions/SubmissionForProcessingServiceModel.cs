namespace OJS.Services.Common.Models.Submissions;

using System;
using OJS.Data.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionForProcessingServiceModel : IMapFrom<SubmissionForProcessing>
{
    public int Id { get; set; }

    public int SubmissionId { get; set; }

    public bool Processing { get; set; }

    public bool Processed { get; set; }

    public DateTime CreatedOn { get; set; }
}