namespace OJS.Servers.Ui.Models.Submissions.Details;

using System;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SubmissionResultsResponseModel : IMapFrom<SubmissionResultsServiceModel>
{
    public int Id { get; set; }

    public string SubmissionType { get; set; } = null!;

    public int Points { get; set; }

    public short MaximumPoints { get; set; }

    public DateTime CreatedOn { get; set; }

    public bool IsProcessed { get; set; }
}