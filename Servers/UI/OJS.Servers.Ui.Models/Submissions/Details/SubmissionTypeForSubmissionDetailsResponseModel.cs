namespace OJS.Servers.Ui.Models.Submissions.Details;

using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Models;

public class
    SubmissionTypeForSubmissionDetailsResponseModel : IMapFrom<SubmissionTypeForSubmissionDetailsServiceModel>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}