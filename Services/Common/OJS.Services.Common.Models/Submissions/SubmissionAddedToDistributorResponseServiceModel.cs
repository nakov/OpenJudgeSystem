namespace OJS.Services.Common.Models.Submissions
{
    using OJS.Data.Models.Submissions;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class SubmissionAddedToDistributorResponseServiceModel : IMapFrom<Submission>
    {
        public int Id { get; set; }
    }
}